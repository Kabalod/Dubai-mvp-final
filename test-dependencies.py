#!/usr/bin/env python3
"""
Test script to verify all dependencies are properly installed
Run this to check if the environment is ready for Django
"""

import sys

def test_imports():
    """Test all required imports"""
    required_modules = [
        'django',
        'djangorestframework',
        'django_cors_headers',
        'gunicorn',
        'environs',
        'marshmallow',
        'psycopg',
        'PIL',
        'diskcache',
        'redis'
    ]
    
    failed_imports = []
    
    for module in required_modules:
        try:
            if module == 'PIL':
                import PIL
                print(f"✅ {module} imported successfully")
            elif module == 'django_cors_headers':
                import corsheaders
                print(f"✅ {module} imported successfully")
            else:
                __import__(module)
                print(f"✅ {module} imported successfully")
        except ImportError as e:
            print(f"❌ {module} import failed: {e}")
            failed_imports.append(module)
    
    return failed_imports

def test_django_setup():
    """Test Django setup"""
    try:
        import django
        from django.conf import settings
        
        # Set Django settings module
        import os
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realty.settings')
        
        # Configure Django
        django.setup()
        
        print("✅ Django setup successful")
        return True
    except Exception as e:
        print(f"❌ Django setup failed: {e}")
        return False

def main():
    print("🔍 Testing dependencies for Dubai MVP...")
    print("=" * 50)
    
    # Test basic imports
    print("\n📦 Testing basic imports:")
    failed_imports = test_imports()
    
    # Test Django setup
    print("\n🐍 Testing Django setup:")
    django_ok = test_django_setup()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    
    if not failed_imports and django_ok:
        print("🎉 All tests passed! Environment is ready.")
        return 0
    else:
        print("❌ Some tests failed:")
        if failed_imports:
            print(f"   - Failed imports: {', '.join(failed_imports)}")
        if not django_ok:
            print("   - Django setup failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
