#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Настройка Git hooks для автоматической генерации Swagger документации...');

// Путь к .git/hooks
const gitHooksDir = path.join(process.cwd(), '..', '.git', 'hooks');
const preCommitHookPath = path.join(gitHooksDir, 'pre-commit');
const scriptPath = path.join(__dirname, 'pre-commit.sh');

try {
  // Проверяем существование .git директории
  if (!fs.existsSync(gitHooksDir)) {
    console.log('⚠️  .git/hooks директория не найдена. Возможно, проект не инициализирован как git репозиторий.');
    process.exit(0);
  }

  // Создаем pre-commit hook
  const hookContent = `#!/bin/bash

# Автоматически сгенерированный pre-commit hook
# Запускает генерацию Swagger документации

echo "🔄 Генерация Swagger документации..."

# Переходим в директорию server
cd "\$(dirname "\$0")/../../server"

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Не найден package.json в директории server"
    exit 1
fi

# Генерируем документацию
npm run swagger:generate

# Проверяем, были ли изменения в генерируемых файлах
if git diff --name-only --cached | grep -E "server/(src/generated/|public/swagger\\.json)" > /dev/null; then
    echo "✅ Документация обновлена и добавлена в коммит"
else
    echo "ℹ️  Документация не изменилась"
fi

echo "✨ Готово!"
`;

  // Записываем hook
  fs.writeFileSync(preCommitHookPath, hookContent);
  
  // Делаем файл исполняемым (на Unix системах)
  if (process.platform !== 'win32') {
    fs.chmodSync(preCommitHookPath, 0o755);
  }
  
  console.log('✅ Git pre-commit hook успешно настроен!');
  console.log('📝 Теперь документация будет автоматически генерироваться при каждом коммите.');
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('⚠️  Не удалось настроить git hooks. Возможные причины:');
    console.log('   - Проект не инициализирован как git репозиторий');
    console.log('   - Недостаточно прав для записи в .git/hooks');
    console.log('');
    console.log('💡 Вы можете настроить hooks вручную, скопировав scripts/pre-commit.sh в .git/hooks/pre-commit');
  } else {
    console.error('❌ Ошибка при настройке git hooks:', error.message);
  }
}