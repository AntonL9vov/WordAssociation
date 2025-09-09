#!/usr/bin/env ts-node

import { AsyncAPIGenerator } from '../generators/asyncapi-generator';

/**
 * Скрипт для генерации AsyncAPI документации
 */
async function generateAsyncAPIDocumentation() {
  console.log('🔄 Генерация AsyncAPI документации для WebSocket событий...');
  
  try {
    const generator = new AsyncAPIGenerator();
    
    // Генерируем JSON спецификацию
    await generator.generateAndSave();
    
    // Генерируем HTML страницу с AsyncAPI Studio
    generator.generateAsyncAPIStudio();
    
    console.log('✨ AsyncAPI документация успешно сгенерирована!');
    console.log('📄 Файлы созданы:');
    console.log('   • public/asyncapi.json - AsyncAPI спецификация');
    console.log('   • public/asyncapi.html - AsyncAPI Studio интерфейс');
    console.log('');
    console.log('🌐 После запуска сервера документация будет доступна по адресам:');
    console.log('   • WebSocket docs: http://localhost:3000/docs');
    console.log('   • AsyncAPI JSON: http://localhost:3000/asyncapi.json');
    
  } catch (error) {
    console.error('❌ Ошибка при генерации AsyncAPI документации:', error);
    process.exit(1);
  }
}

// Запускаем генерацию если файл вызван напрямую
if (require.main === module) {
  generateAsyncAPIDocumentation();
}

export { generateAsyncAPIDocumentation };