from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Avg, Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import datetime

from realty.pfimport.models import PFListSale, PFListRent, Building, Area
from realty.reports.models import BuildingReport
from .serializers import (
    PropertySerializer, PropertySearchSerializer, UserRegistrationSerializer, 
    UserLoginSerializer, AnalyticsSerializer, BuildingReportSerializer,
    AreaSerializer, BuildingSerializer
)


# ========================================
# Health Check & System Info
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring."""
    try:
        # Check database connectivity
        sale_count = PFListSale.objects.count()
        rent_count = PFListRent.objects.count()
        
        # Check recent data
        yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
        recent_sales = PFListSale.objects.filter(added_on__gte=yesterday).count()
        recent_rents = PFListRent.objects.filter(added_on__gte=yesterday).count()
        
        return Response({
            'status': 'healthy',
            'timestamp': datetime.datetime.now().isoformat(),
            'database': 'connected',
            'service': 'realty-api',
            'data': {
                'total_sale_properties': sale_count,
                'total_rent_properties': rent_count,
                'recent_sales_24h': recent_sales,
                'recent_rents_24h': recent_rents,
            }
        })
        
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'timestamp': datetime.datetime.now().isoformat(),
            'error': str(e),
            'service': 'realty-api'
        }, status=500)


# ========================================
# Authentication API
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint."""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """User logout endpoint."""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({'message': 'Logout successful'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ========================================
# Properties API
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])  # Public for MVP, change to IsAuthenticated for production
def properties_list(request):
    """Get list of properties with search and filtering."""
    search_serializer = PropertySearchSerializer(data=request.query_params)
    if not search_serializer.is_valid():
        return Response(search_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    params = search_serializer.validated_data
    
    # Build queries for both sale and rent properties
    sale_qs = PFListSale.objects.select_related('area', 'building')
    rent_qs = PFListRent.objects.select_related('area', 'building')
    
    # Apply filters
    if params.get('search'):
        search_term = params['search']
        sale_qs = sale_qs.filter(
            Q(title__icontains=search_term) |
            Q(display_address__icontains=search_term) |
            Q(area__name__icontains=search_term)
        )
        rent_qs = rent_qs.filter(
            Q(title__icontains=search_term) |
            Q(display_address__icontains=search_term) |
            Q(area__name__icontains=search_term)
        )
    
    if params.get('property_type'):
        sale_qs = sale_qs.filter(property_type__icontains=params['property_type'])
        rent_qs = rent_qs.filter(property_type__icontains=params['property_type'])
    
    if params.get('bedrooms'):
        sale_qs = sale_qs.filter(bedrooms=params['bedrooms'])
        rent_qs = rent_qs.filter(bedrooms=params['bedrooms'])
    
    if params.get('area'):
        sale_qs = sale_qs.filter(area__name__icontains=params['area'])
        rent_qs = rent_qs.filter(area__name__icontains=params['area'])
    
    if params.get('min_price'):
        sale_qs = sale_qs.filter(price__gte=params['min_price'])
        rent_qs = rent_qs.filter(price__gte=params['min_price'])
    
    if params.get('max_price'):
        sale_qs = sale_qs.filter(price__lte=params['max_price'])
        rent_qs = rent_qs.filter(price__lte=params['max_price'])
    
    # Filter by listing type if specified
    properties_data = []
    
    if not params.get('listing_type') or params['listing_type'] == 'sale':
        sale_properties = sale_qs.order_by('-added_on')[params['offset']:params['offset'] + params['limit']]
        for prop in sale_properties:
            properties_data.append({
                'id': f"sale_{prop.listing_id}",
                'title': prop.title or '',
                'display_address': prop.display_address or '',
                'bedrooms': prop.bedrooms,
                'bathrooms': prop.bathrooms,
                'price': float(prop.price) if prop.price else 0,
                'price_currency': prop.price_currency or 'AED',
                'property_type': prop.property_type or '',
                'listing_type': 'sale',
                'added_on': prop.added_on,
                'latitude': float(prop.latitude) if prop.latitude else None,
                'longitude': float(prop.longitude) if prop.longitude else None,
                'numeric_area': float(prop.numeric_area) if prop.numeric_area else None,
                'furnishing': prop.furnishing,
                'broker': prop.broker,
                'agent': prop.agent,
                'verified': prop.verified,
            })
    
    if not params.get('listing_type') or params['listing_type'] == 'rent':
        rent_properties = rent_qs.order_by('-added_on')[params['offset']:params['offset'] + params['limit']]
        for prop in rent_properties:
            properties_data.append({
                'id': f"rent_{prop.listing_id}",
                'title': prop.title or '',
                'display_address': prop.display_address or '',
                'bedrooms': prop.bedrooms,
                'bathrooms': prop.bathrooms,
                'price': float(prop.price) if prop.price else 0,
                'price_currency': prop.price_currency or 'AED',
                'property_type': prop.property_type or '',
                'listing_type': 'rent',
                'added_on': prop.added_on,
                'latitude': float(prop.latitude) if prop.latitude else None,
                'longitude': float(prop.longitude) if prop.longitude else None,
                'numeric_area': float(prop.numeric_area) if prop.numeric_area else None,
                'furnishing': prop.furnishing,
                'broker': prop.broker,
                'agent': prop.agent,
                'verified': prop.verified,
            })
    
    # Sort combined results by date
    properties_data.sort(key=lambda x: x['added_on'] or datetime.datetime.min, reverse=True)
    
    return Response({
        'count': len(properties_data),
        'results': properties_data[:params['limit']]
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def areas_list(request):
    """Get list of areas."""
    areas = Area.objects.all().order_by('name')
    serializer = AreaSerializer(areas, many=True)
    return Response({
        'count': areas.count(),
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def buildings_list(request):
    """Get list of buildings."""
    buildings = Building.objects.select_related('area').all().order_by('name')
    
    # Add filtering
    area = request.query_params.get('area')
    if area:
        buildings = buildings.filter(area__name__icontains=area)
    
    limit = int(request.query_params.get('limit', 100))
    offset = int(request.query_params.get('offset', 0))
    
    buildings_page = buildings[offset:offset + limit]
    serializer = BuildingSerializer(buildings_page, many=True)
    
    return Response({
        'count': len(serializer.data),
        'results': serializer.data
    })


# ========================================
# Analytics API
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_summary(request):
    """Get analytics summary for dashboard."""
    
    # Basic counts
    total_sale_properties = PFListSale.objects.count()
    total_rent_properties = PFListRent.objects.count()
    total_buildings = Building.objects.count()
    total_areas = Area.objects.count()
    
    # Average prices
    avg_sale_price = PFListSale.objects.aggregate(avg=Avg('price'))['avg']
    avg_rent_price = PFListRent.objects.aggregate(avg=Avg('price'))['avg']
    
    # Properties by type
    sale_by_type = {}
    for item in PFListSale.objects.values('property_type').annotate(count=Count('id')):
        if item['property_type']:
            sale_by_type[item['property_type']] = item['count']
    
    rent_by_type = {}
    for item in PFListRent.objects.values('property_type').annotate(count=Count('id')):
        if item['property_type']:
            rent_by_type[item['property_type']] = item['count']
    
    # Properties by bedrooms
    properties_by_bedrooms = {}
    for item in PFListSale.objects.values('bedrooms').annotate(count=Count('id')):
        if item['bedrooms']:
            key = f"{item['bedrooms']} bedrooms"
            properties_by_bedrooms[key] = properties_by_bedrooms.get(key, 0) + item['count']
    
    for item in PFListRent.objects.values('bedrooms').annotate(count=Count('id')):
        if item['bedrooms']:
            key = f"{item['bedrooms']} bedrooms"
            properties_by_bedrooms[key] = properties_by_bedrooms.get(key, 0) + item['count']
    
    # Top areas by property count
    properties_by_area = {}
    for item in Area.objects.values('name').annotate(count=Count('pflistsale') + Count('pflistrent')):
        if item['count'] > 0:
            properties_by_area[item['name']] = item['count']
    
    analytics_data = {
        'total_properties': total_sale_properties + total_rent_properties,
        'total_sale_properties': total_sale_properties,
        'total_rent_properties': total_rent_properties,
        'total_buildings': total_buildings,
        'total_areas': total_areas,
        'avg_sale_price': avg_sale_price,
        'avg_rent_price': avg_rent_price,
        'properties_by_type': {**sale_by_type, **rent_by_type},
        'properties_by_bedrooms': properties_by_bedrooms,
        'properties_by_area': dict(sorted(properties_by_area.items(), key=lambda x: x[1], reverse=True)[:10])
    }
    
    return Response(analytics_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def building_reports(request):
    """Get building reports with analytics."""
    reports = BuildingReport.objects.select_related('building', 'area').all()
    
    # Add filtering
    area = request.query_params.get('area')
    if area:
        reports = reports.filter(area__name__icontains=area)
    
    bedrooms = request.query_params.get('bedrooms')
    if bedrooms:
        reports = reports.filter(bedrooms=bedrooms)
    
    limit = int(request.query_params.get('limit', 50))
    offset = int(request.query_params.get('offset', 0))
    
    reports_page = reports.order_by('-calculated_at')[offset:offset + limit]
    serializer = BuildingReportSerializer(reports_page, many=True)
    
    return Response({
        'count': len(serializer.data),
        'results': serializer.data
    })