PNG эталоны для Storybook

- Храним эталонные изображения только в PNG (192–256 DPI).
- Рекомендуемая структура:
  - Storybook/png/button/*.png
  - Storybook/png/header/*.png
  - Storybook/png/card/*.png
  - Storybook/png/tabs/*.png
  - Storybook/png/inputs/*.png

Получение PNG из PDF

Из корня проекта:

py Storybook\scripts\pdf_to_assets.py "Storybook/Book_component.pdf" "Storybook/svg" "Storybook/png" 192

Подключение в MDX

1) Скопируйте шаблон из Storybook/reference/templates/*.mdx.template в .mdx
2) Обновите пути к PNG
3) Откройте Storybook и сравните с реализацией


