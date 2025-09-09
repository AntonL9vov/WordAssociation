#!/bin/bash

# Git pre-commit hook для автоматической генерации Swagger документации

echo "🔄 Генерация Swagger документации..."

# Переходим в директорию server
cd "$(dirname "$0")/.."

# Генерируем документацию
npm run swagger:generate

# Проверяем, были ли изменения в генерируемых файлах
if git diff --name-only | grep -E "(src/generated/|public/swagger\.json)" > /dev/null; then
    echo "✅ Документация обновлена"
    
    # Добавляем изменения в коммит
    git add src/generated/routes.ts
    git add public/swagger.json
    
    echo "📄 Обновленная документация добавлена в коммит"
else
    echo "ℹ️  Документация не изменилась"
fi

echo "✨ Готово!"