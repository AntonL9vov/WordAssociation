# Инструкции по развертыванию на VDS сервере

## Подготовка к развертыванию

1. **Скопируйте `.env.example` в `.env` и настройте переменные:**
   ```bash
   cp .env.example .env
   ```
   
2. **Отредактируйте `.env` файл:**
   - Замените `your_secure_password_here` на надежный пароль
   - Настройте URL для вашего домена/IP адреса
   - Для продакшена измените `localhost` на ваш домен/IP

## Быстрое развертывание

### Вариант 1: Обычная сборка
```bash
docker-compose up --build -d
```

### Вариант 2: Параллельная сборка (рекомендуется)
```bash
# Включить BuildKit для ускорения
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Запуск с параллельной сборкой
docker-compose up --build --parallel -d
```

### Вариант 3: Поэтапная сборка (при проблемах с памятью)
```bash
# Сначала база данных
docker-compose up postgres -d

# Ждем готовности БД
docker-compose logs -f postgres

# Затем сервер
docker-compose up server --build -d

# И клиент
docker-compose up client --build -d
```

## Устранение проблем

### Если сборка медленная:

1. **Очистите Docker кеш:**
   ```bash
   docker system prune -a --volumes
   ```

2. **Проверьте использование памяти:**
   ```bash
   docker stats
   ```

3. **Увеличьте лимиты Docker (если нужно):**
   ```bash
   # В /etc/docker/daemon.json
   {
     "storage-opts": ["overlay2.size=100G"],
     "log-opts": {"max-size": "10m", "max-file": "3"}
   }
   ```

### Мониторинг процесса:

```bash
# Просмотр логов всех сервисов
docker-compose logs -f

# Просмотр статуса
docker-compose ps

# Просмотр использования ресурсов
docker stats $(docker-compose ps -q)
```

## Оптимизации

1. **BuildKit включен** - ускоряет сборку
2. **Многостадийная сборка** - уменьшает размер образов
3. **.dockerignore файлы** - исключают ненужные файлы
4. **npm ci вместо npm install** - быстрее и надежнее
5. **Правильное кеширование слоев** - package.json копируется отдельно

## Проверка работоспособности

После успешного запуска:
- Приложение будет доступно на порту 80
- API документация: http://ваш-домен/api/docs
- Здоровье сервера: http://ваш-домен/api/health