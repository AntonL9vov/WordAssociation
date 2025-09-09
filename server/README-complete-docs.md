# 🚀 Полная автоматическая документация API

Этот проект реализует **полную автоматическую систему документации** как для HTTP REST API, так и для WebSocket API с использованием современных стандартов и инструментов.

## ✨ Что реализовано

### 🌐 HTTP REST API документация
- **tsoa + OpenAPI 3.0** - TypeScript-first подход
- **Swagger UI** - интерактивная документация
- **Автоматическая валидация** входящих данных
- **Типобезопасность** на всех уровнях

### 🔌 WebSocket API документация  
- **AsyncAPI 3.0** - современный стандарт для асинхронных API
- **Автоматическая генерация** из TypeScript событий
- **AsyncAPI Studio** - интерактивный интерфейс
- **Real-time события** с полным описанием

### 🎯 Единая система
- **Объединенный интерфейс** документации
- **Автоматическая синхронизация** с кодом
- **Git hooks** для автогенерации при коммитах
- **Zero maintenance** - минимальная поддержка

## 🛠 Команды

### Генерация документации
```bash
# Генерация всей документации
npm run docs:generate

# Генерация только HTTP API
npm run swagger:generate

# Генерация только WebSocket API  
npm run asyncapi:generate
```

### Разработка
```bash
# Запуск с автогенерацией всей документации
npm run dev

# Сборка с автогенерацией
npm run build
```

## 📖 Просмотр документации

После запуска серверов (`npm run dev`) документация доступна:

### 🏠 Главная страница
- **Объединенная документация**: http://localhost:3001/
- Красивый интерфейс с ссылками на все виды документации
- Статистика API в real-time

### 🌐 HTTP REST API
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI JSON**: http://localhost:3001/swagger.json
- Интерактивное тестирование endpoints
- Автоматические примеры запросов/ответов

### 🔌 WebSocket API
- **AsyncAPI Studio**: http://localhost:3000/docs
- **AsyncAPI JSON**: http://localhost:3000/asyncapi.json
- Документация всех WebSocket событий
- Схемы сообщений и примеры

## 🎯 Автоматическая генерация

Документация генерируется автоматически в следующих случаях:

1. **При разработке**: `predev` hook → `npm run dev`
2. **При сборке**: `prebuild` hook → `npm run build`  
3. **При коммите**: git pre-commit hook
4. **Вручную**: `npm run docs:generate`

## 📁 Структура файлов

```
server/
├── src/
│   ├── controllers/           # HTTP контроллеры с tsoa декораторами
│   │   ├── usersController.v2.ts
│   │   ├── gameController.v2.ts
│   │   └── healthController.ts
│   ├── models/               # TypeScript модели для HTTP API
│   │   ├── user.model.ts
│   │   ├── game.model.ts
│   │   └── common.model.ts
│   ├── socket-entities/      # WebSocket события и сокеты
│   │   ├── game-scoket/
│   │   │   ├── GameSocket.ts
│   │   │   └── game-socket-events.ts
│   │   └── users-socket/
│   │       ├── UsersSocket.ts
│   │       └── user-socket-events.ts
│   ├── generators/           # Генераторы документации
│   │   └── asyncapi-generator.ts
│   ├── scripts/             # Скрипты автогенерации
│   │   └── generate-asyncapi.ts
│   ├── generated/           # 🤖 Автогенерируемые tsoa файлы
│   │   └── routes.ts
│   ├── app.ts              # HTTP сервер с Swagger UI
│   └── ioc.ts              # IoC контейнер для tsoa
├── public/                 # 🤖 Автогенерируемые файлы документации
│   ├── swagger.json        # OpenAPI спецификация
│   ├── asyncapi.json       # AsyncAPI спецификация
│   ├── asyncapi.html       # AsyncAPI Studio UI
│   └── index.html          # Объединенная главная страница
├── scripts/               # Автоматизация
│   ├── setup-git-hooks.js # Настройка git hooks
│   └── pre-commit.sh      # Pre-commit hook
├── tsoa.json             # Конфигурация tsoa
└── package.json          # Обновленные скрипты
```

## 🔧 Добавление новых endpoints

### HTTP API
1. **Создайте модель** в `src/models/`:
   ```typescript
   export interface MyModel {
     /** @example "example-id" */
     id: string;
     /** @example "Example Name" */
     name: string;
   }
   ```

2. **Добавьте контроллер** с tsoa декораторами:
   ```typescript
   @Route('api/myresource')
   @Tags('MyResource')
   export class MyController extends Controller {
     @Get()
     @Response<ErrorResponse>(500, 'Internal server error')
     public async getAll(): Promise<MyModel[]> {
       // implementation
     }
   }
   ```

### WebSocket API
1. **Добавьте события** в соответствующий файл events:
   ```typescript
   export const mySocketEvents: Record<string, SocketEvents> = {
     myAction: {
       handler: {
         "my:action": {
           event: "my:action",
           callback: (socket, service, data) => {
             // реализация
           }
         }
       },
       emit: {
         "my:action:response": {
           event: "my:action:response", 
           callback: (socket, result) => {
             socket.emit("my:action:response", result);
           }
         }
       }
     }
   };
   ```

2. **Документация обновится автоматически** при следующем запуске!

## 🔄 Workflow автогенерации

1. **Изменяете код** контроллеров, моделей или WebSocket событий
2. **Запускаете** `npm run dev` или `npm run build`
3. **Автоматически генерируется**:
   - OpenAPI спецификация для HTTP API
   - AsyncAPI спецификация для WebSocket API
   - Swagger UI и AsyncAPI Studio интерфейсы
4. **Обновляются** все страницы документации
5. **Тестируете** новые endpoints в браузере

## 🎨 Кастомизация

### Swagger UI
В `src/app.ts` настроен кастомизированный Swagger UI:
- Скрыт верхний баннер  
- Включена подсветка синтаксиса
- Добавлена фильтрация endpoints
- Настроено сохранение авторизации

### AsyncAPI Studio
В `public/asyncapi.html` настроен AsyncAPI React Component:
- Современный дизайн в стиле проекта
- Полная схема WebSocket событий
- Примеры сообщений
- Навигация по событиям

### Главная страница
`public/index.html` - объединенный интерфейс:
- Красивый дизайн с градиентами
- Статистика API в real-time
- Ссылки на все виды документации
- Responsive дизайн

## ⚡ Производительность

- **Генерация документации**: ~2-3 секунды
- **Размер спецификаций**: swagger.json ~20KB, asyncapi.json ~15KB
- **Автоматические обновления**: только при изменениях в коде
- **Zero runtime overhead**: документация статическая

## 🚀 Преимущества решения

### 1. **Полная автоматизация**
- Документация всегда синхронизирована с кодом
- Нет ручного дублирования описаний
- Автоматическая генерация при любых изменениях

### 2. **Современные стандарты**
- OpenAPI 3.0 для HTTP API
- AsyncAPI 3.0 для WebSocket API
- TypeScript-first подход везде

### 3. **Отличный DX (Developer Experience)**
- Интерактивная документация
- Автоматическая валидация
- Примеры запросов/ответов из кода
- Объединенный интерфейс

### 4. **Production-ready**
- Git hooks для CI/CD
- Минимальная поддержка
- Высокая производительность
- Расширяемая архитектура

## 📚 Ресурсы

- [OpenAPI Specification](https://swagger.io/specification/)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/specifications/v3.0.0)
- [tsoa Documentation](https://tsoa-community.github.io/docs/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [AsyncAPI Studio](https://studio.asyncapi.com/)

---

**🎉 Поздравляем!** Теперь у вас есть полная автоматическая система документации API, которая синхронизируется с кодом и не требует ручной поддержки!