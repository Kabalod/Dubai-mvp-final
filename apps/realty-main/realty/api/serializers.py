from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework import serializers as drf_serializers
from realty.api.models import Payment, PaymentEventAudit, UserReportHistory
try:
    from realty.pfimport.models import PFListSale, PFListRent, Building, Area
except Exception:  # pragma: no cover - optional deps not loaded in MVP
    PFListSale = PFListRent = Building = Area = None

try:
    from realty.reports.models import BuildingReport
except Exception:  # pragma: no cover
    BuildingReport = None


class PropertySerializer(serializers.Serializer):
    """Unified property serializer for both sale and rent properties."""
    
    id = serializers.CharField()
    listing_id = serializers.CharField()
    title = serializers.CharField()
    display_address = serializers.CharField()
    bedrooms = serializers.CharField(allow_null=True)
    bathrooms = serializers.CharField(allow_null=True)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    price_currency = serializers.CharField(default='AED')
    price_duration = serializers.CharField(allow_null=True)
    property_type = serializers.CharField()
    listing_type = serializers.CharField()
    numeric_area = serializers.FloatField(allow_null=True)
    size_min = serializers.CharField(allow_null=True)
    furnishing = serializers.CharField(allow_null=True)
    broker = serializers.CharField(allow_null=True)
    agent = serializers.CharField(allow_null=True)
    agent_phone = serializers.CharField(allow_null=True)
    verified = serializers.BooleanField(default=False)
    latitude = serializers.FloatField(allow_null=True)
    longitude = serializers.FloatField(allow_null=True)
    added_on = serializers.DateTimeField(allow_null=True)
    url = serializers.URLField(allow_null=True)
    description = serializers.CharField(allow_null=True)
    
    # Связанные объекты
    area_name = serializers.CharField(allow_null=True, source='area.area_name')
    building_name = serializers.CharField(allow_null=True, source='building.building_name')


if Area is not None:
    class AreaSerializer(serializers.ModelSerializer):
        """Serializer for Area model."""
        class Meta:
            model = Area
            fields = [
                'id', 'name', 'verified_value', 
                'numbers_of_processed_ads', 'sum_number_of_days_for_all_ads'
            ]

if Building is not None and Area is not None:
    class BuildingSerializer(serializers.ModelSerializer):
        """Serializer for Building model."""
        area = AreaSerializer(read_only=True)
        class Meta:
            model = Building
            fields = [
                'id', 'name', 'area', 'latitude', 'longitude',
                'numbers_of_processed_rent_ads', 'numbers_of_processed_sale_ads'
            ]

if BuildingReport is not None and Building is not None and Area is not None:
    class BuildingReportSerializer(serializers.ModelSerializer):
        """Serializer for Building reports with analytics."""
        building = BuildingSerializer(read_only=True)
        area = AreaSerializer(read_only=True)
        class Meta:
            model = BuildingReport
            fields = [
                'id', 'building', 'area', 'bedrooms', 'calculated_at',
                'avg_sale_price', 'median_sale_price', 'min_sale_price', 'max_sale_price',
                'sale_count', 'avg_rent_price', 'median_rent_price', 'min_rent_price', 
                'max_rent_price', 'rent_count', 'roi'
            ]

class PropertySearchSerializer(serializers.Serializer):
    """Serializer for property search parameters."""
    
    search = serializers.CharField(required=False, allow_blank=True)
    property_type = serializers.CharField(required=False, allow_blank=True)
    listing_type = serializers.ChoiceField(
        choices=[('sale', 'Sale'), ('rent', 'Rent')],
        required=False,
        allow_blank=True
    )
    min_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    bedrooms = serializers.CharField(required=False, allow_blank=True)
    area = serializers.CharField(required=False, allow_blank=True)
    limit = serializers.IntegerField(default=50, max_value=500)
    offset = serializers.IntegerField(default=0, min_value=0)


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """User login serializer."""
    
    username = serializers.CharField()
    password = serializers.CharField()


class AnalyticsSerializer(serializers.Serializer):
    """Analytics data serializer."""
    
    total_properties = serializers.IntegerField()
    total_sale_properties = serializers.IntegerField()
    total_rent_properties = serializers.IntegerField()
    total_buildings = serializers.IntegerField()
    total_areas = serializers.IntegerField()
    avg_sale_price = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)
    avg_rent_price = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)
    properties_by_type = serializers.DictField()
    properties_by_bedrooms = serializers.DictField()
    properties_by_area = serializers.DictField()


class ProfileSerializer(drf_serializers.Serializer):
    """Simple profile serializer for MVP."""
    id = drf_serializers.IntegerField()
    email = drf_serializers.EmailField(allow_blank=True, allow_null=True)
    role = drf_serializers.CharField(default="free")


class UserReportHistorySerializer(drf_serializers.ModelSerializer):
    """User report history serializer."""
    class Meta:
        model = UserReportHistory
        fields = ['id', 'user', 'report_type', 'generated_at', 'file_path', 'parameters']


# Additional serializers for API views
class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        

class RegisterSerializer(serializers.ModelSerializer):
    """User registration serializer (alias for compatibility)."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class OTPLoginSerializer(serializers.Serializer):
    """OTP login serializer."""
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']


class PaymentSerializer(serializers.ModelSerializer):
    """Payment serializer."""
    class Meta:
        model = Payment
        fields = '__all__'


class PaymentEventAuditSerializer(serializers.ModelSerializer):
    """Payment event audit serializer."""
    class Meta:
        model = PaymentEventAudit
        fields = '__all__'