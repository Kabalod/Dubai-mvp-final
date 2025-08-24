# Manual migration to sync existing models without touching non-existent ones
# Generated manually on 2025-08-24

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_userreporthistory_remove_report_user_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Update existing Payment model fields (if they exist in the actual database)
        # Only operations that are safe and relate to existing tables
        
        # Update model options for existing models
        migrations.AlterModelOptions(
            name='otpcode',
            options={'ordering': ['-created_at'], 'verbose_name': 'OTP Code', 'verbose_name_plural': 'OTP Codes'},
        ),
        migrations.AlterModelOptions(
            name='payment', 
            options={'ordering': ['-created_at'], 'verbose_name': 'Payment', 'verbose_name_plural': 'Payments'},
        ),
        migrations.AlterModelOptions(
            name='paymenteventaudit',
            options={'ordering': ['-created_at'], 'verbose_name': 'Payment Event Audit', 'verbose_name_plural': 'Payment Event Audits'},
        ),

        # Remove custom db_table constraints (use default Django table naming)
        migrations.AlterModelTable(
            name='otpcode',
            table=None,
        ),
        migrations.AlterModelTable(
            name='payment',
            table=None,
        ),
        migrations.AlterModelTable(
            name='paymenteventaudit', 
            table=None,
        ),
    ]
