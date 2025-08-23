from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
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


