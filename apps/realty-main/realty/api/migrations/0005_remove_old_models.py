# Generated manually to clean up old unused models

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_userreporthistory_remove_report_user_and_more'),
    ]

    operations = [
        # Remove old models that are no longer in models.py
        migrations.DeleteModel(
            name='SubscriptionPlan',
        ),
        migrations.DeleteModel(
            name='UserProfile',
        ),
        migrations.DeleteModel(
            name='UserSubscription',
        ),
        migrations.DeleteModel(
            name='Report',
        ),
    ]
