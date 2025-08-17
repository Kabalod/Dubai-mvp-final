from django.core.management.base import BaseCommand
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site


class Command(BaseCommand):
    help = 'Настройка Google OAuth для django-allauth'

    def handle(self, *args, **options):
        try:
            # Создаем или получаем сайт
            site, site_created = Site.objects.get_or_create(
                id=1,
                defaults={
                    'domain': 'localhost:8000',
                    'name': 'localhost'
                }
            )
            
            if site_created:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Создан новый сайт: {site.domain}')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Найден существующий сайт: {site.domain}')
                )
            
            # Создаем или получаем Google OAuth приложение
            app, app_created = SocialApp.objects.get_or_create(
                provider='google',
                defaults={
                    'name': 'Google OAuth',
                    'client_id': 'test-client-id-12345',
                    'secret': 'test-secret-key-12345'
                }
            )
            
            if app_created:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Создано новое Google OAuth приложение: {app.name}')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Найдено существующее Google OAuth приложение: {app.name}')
                )
            
            # Добавляем сайт к приложению
            app.sites.add(site)
            self.stdout.write(
                self.style.SUCCESS(f'✅ Сайт {site.domain} добавлен к приложению {app.name}')
            )
            
            self.stdout.write(f'\n📋 Детали приложения:')
            self.stdout.write(f'   ID: {app.id}')
            self.stdout.write(f'   Provider: {app.provider}')
            self.stdout.write(f'   Name: {app.name}')
            self.stdout.write(f'   Client ID: {app.client_id}')
            self.stdout.write(f'   Sites: {[s.domain for s in app.sites.all()]}')
            
            self.stdout.write(
                self.style.SUCCESS('\n🎉 Google OAuth настроен успешно!')
            )
            self.stdout.write(
                'Теперь можно тестировать Google вход на http://localhost:8000/accounts/google/login/'
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Ошибка при настройке Google OAuth: {e}')
            )
            import traceback
            traceback.print_exc()
