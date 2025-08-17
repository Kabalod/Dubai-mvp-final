docker-compose up --build

# i18n

1. Добавлять строки через компонент <Trans> или обёртку t (alias i18n.\_). Обязательно добавлять id элемента по паттерну {название компонента или страницы}.{#}
2. npm run extract -- выносит все i18n строки в файлы .po (src/locales/{language}/messages.po)
3. при необходимости добавить переводы в файлы .po
4. npm run compile
