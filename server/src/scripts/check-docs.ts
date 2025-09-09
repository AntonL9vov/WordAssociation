#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Проверяет, нужно ли генерировать документацию
 */
function shouldGenerateDocumentation(): boolean {
  const swaggerPath = path.join(process.cwd(), 'public', 'swagger.json');
  const asyncApiPath = path.join(process.cwd(), 'public', 'asyncapi.json');
  
  // Проверяем существование файлов
  const swaggerExists = fs.existsSync(swaggerPath);
  const asyncApiExists = fs.existsSync(asyncApiPath);
  
  if (!swaggerExists || !asyncApiExists) {
    console.log('📝 Documentation files missing - generation needed');
    return true;
  }
  
  // Проверяем возраст файлов (если старше 1 часа, перегенерируем)
  const swaggerStat = fs.statSync(swaggerPath);
  const asyncApiStat = fs.statSync(asyncApiPath);
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  if (swaggerStat.mtime.getTime() < oneHourAgo || asyncApiStat.mtime.getTime() < oneHourAgo) {
    console.log('⏰ Documentation files are old - regeneration needed');
    return true;
  }
  
  console.log('✅ Documentation files are up to date');
  return false;
}

export { shouldGenerateDocumentation };

// Запускаем проверку если файл вызван напрямую
if (require.main === module) {
  const needsGeneration = shouldGenerateDocumentation();
  process.exit(needsGeneration ? 1 : 0);
}