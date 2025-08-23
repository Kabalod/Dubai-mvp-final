# Generated manually for Railway deployment

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OTPCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('code', models.CharField(max_length=6)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('is_used', models.BooleanField(default=False)),
                ('attempts', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'api_otp_codes',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=32, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('price_aed', models.DecimalField(decimal_places=2, max_digits=10)),
                ('period_days', models.PositiveIntegerField(default=30)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={'db_table': 'api_subscription_plan'},
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('free', 'Free'), ('paid', 'Paid'), ('admin', 'Admin')], default='free', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={'db_table': 'api_user_profile'},
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount_aed', models.DecimalField(decimal_places=2, max_digits=10)),
                ('method', models.CharField(choices=[('mock', 'Mock'), ('card', 'Card'), ('paypal', 'PayPal'), ('crypto', 'Crypto')], default='mock', max_length=16)),
                ('provider', models.CharField(default='mock', max_length=32)),
                ('status', models.CharField(choices=[('succeeded', 'Succeeded'), ('failed', 'Failed'), ('pending', 'Pending')], default='succeeded', max_length=16)),
                ('paid_at', models.DateTimeField(auto_now_add=True)),
                ('external_id', models.CharField(blank=True, max_length=128, null=True)),
                ('plan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.subscriptionplan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={'db_table': 'api_payment'},
        ),
        migrations.CreateModel(
            name='UserSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('free', 'Free'), ('active', 'Active'), ('expired', 'Expired')], default='free', max_length=16)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('valid_until', models.DateTimeField(blank=True, null=True)),
                ('payment_method', models.CharField(blank=True, max_length=32, null=True)),
                ('last_payment_at', models.DateTimeField(blank=True, null=True)),
                ('plan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.subscriptionplan')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='subscription', to=settings.AUTH_USER_MODEL)),
            ],
            options={'db_table': 'api_user_subscription'},
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('queued', 'Queued'), ('processing', 'Processing'), ('ready', 'Ready'), ('failed', 'Failed')], default='queued', max_length=16)),
                ('payload', models.JSONField(blank=True, null=True)),
                ('result', models.JSONField(blank=True, null=True)),
                ('error', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports', to=settings.AUTH_USER_MODEL)),
            ],
            options={'db_table': 'api_report', 'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='PaymentEventAudit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('provider', models.CharField(max_length=32)),
                ('event_type', models.CharField(max_length=64)),
                ('event_id', models.CharField(max_length=128)),
                ('idempotency_key', models.CharField(blank=True, max_length=128, null=True)),
                ('signature', models.CharField(blank=True, max_length=256, null=True)),
                ('payload', models.JSONField(blank=True, null=True)),
                ('status', models.CharField(choices=[('received', 'Received'), ('processed', 'Processed'), ('skipped', 'Skipped'), ('failed', 'Failed')], default='received', max_length=16)),
                ('processed_at', models.DateTimeField(blank=True, null=True)),
                ('attempt_count', models.PositiveIntegerField(default=0)),
                ('error', models.TextField(blank=True, null=True)),
                ('payment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.payment')),
            ],
            options={'db_table': 'api_payment_event_audit'},
        ),
        migrations.AddIndex(
            model_name='paymenteventaudit',
            index=models.Index(fields=['provider', 'event_id'], name='idx_provider_event'),
        ),
        migrations.AddIndex(
            model_name='paymenteventaudit',
            index=models.Index(fields=['idempotency_key'], name='idx_idem_key'),
        ),
        migrations.AddConstraint(
            model_name='paymenteventaudit',
            constraint=models.UniqueConstraint(fields=('provider', 'event_id'), name='uniq_provider_event'),
        ),
    ]
