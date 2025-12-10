# Rosinka Backend - Docker Deployment

## Быстрый старт

### Предварительные требования

- Docker
- Docker Compose

### Запуск приложения

1. **Клонируйте репозиторий** (если еще не сделали):

```bash
git clone <your-repo-url>
cd rosinka-backend
```

2. **Запустите приложение**:

```bash
docker-compose up -d
```

Первый запуск может занять несколько минут, так как Docker:

- Скачает образы PostgreSQL и Java
- Соберет Spring Boot приложение
- Инициализирует базу данных

3. **Проверьте статус**:

```bash
docker-compose ps
```

Оба контейнера должны быть в статусе "Up".

4. **Откройте приложение**:

- Приложение: http://localhost:8081
- База данных: localhost:5433

### Полезные команды

#### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Логи только приложения
docker-compose logs -f app

# Логи только БД
docker-compose logs -f postgres
```

#### Остановка приложения

```bash
docker-compose down
```

#### Остановка с удалением данных

```bash
docker-compose down -v
```

#### Перезапуск после изменений кода

```bash
docker-compose down
docker-compose up -d --build
```

#### Перезапуск только приложения

```bash
docker-compose restart app
```

### Доступ к базе данных

**Параметры подключения:**

- Host: localhost
- Port: 5433
- Database: rosinka
- Username: postgres
- Password: postgres

**Подключение через psql:**

```bash
docker exec -it rosinka-db psql -U postgres -d rosinka
```

### Структура проекта

```
rosinka-backend/
├── Dockerfile              # Конфигурация Docker образа
├── docker-compose.yml      # Оркестрация контейнеров
├── .dockerignore          # Исключения при сборке образа
├── init.sql               # Инициализация БД
└── uploads/               # Директория для загрузок (смонтирована)
```

### Порты

- **8081** - Spring Boot приложение
- **5433** - PostgreSQL (внешний доступ)

_Примечание: Порты 3000, 5432, 54320, 3001 и 8080 заняты, поэтому используются 8081 и 5433_

### Переменные окружения

Можно настроить через `docker-compose.yml`:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/rosinka
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: postgres
  SERVER_PORT: 8081
```

### Troubleshooting

#### Порт уже занят

Если порт 8081 занят, измените в `docker-compose.yml`:

```yaml
ports:
  - '9090:8081' # Внешний порт 9090
```

#### Проблемы с подключением к БД

```bash
# Проверьте, что PostgreSQL запущен
docker-compose ps postgres

# Проверьте логи БД
docker-compose logs postgres
```

#### Приложение не запускается

```bash
# Пересоберите образ
docker-compose build --no-cache
docker-compose up -d
```

### Демонстрация преподавателю

1. Убедитесь, что Docker запущен
2. Выполните команду:

```bash
docker-compose up -d
```

3. Дождитесь запуска (около 1-2 минут)
4. Откройте браузер: http://localhost:8081
5. Для остановки:

```bash
docker-compose down
```

### Деплой на удаленный сервер

Если друг будет деплоить:

1. **Отправьте ему весь проект** или попросите склонировать репозиторий

2. **На сервере выполнить**:

```bash
docker-compose up -d
```

3. **Проверить доступность**:

```bash
curl http://localhost:8081
```

### Бэкап данных

```bash
# Создать бэкап
docker exec rosinka-db pg_dump -U postgres rosinka > backup.sql

# Восстановить бэкап
docker exec -i rosinka-db psql -U postgres rosinka < backup.sql
```

---

## Production Deployment

Для production окружения рекомендуется:

1. Использовать отдельный `docker-compose.prod.yml`
2. Настроить HTTPS через Nginx
3. Использовать Docker secrets для паролей
4. Настроить регулярные бэкапы
5. Добавить мониторинг (Prometheus + Grafana)

## Поддержка

При возникновении проблем проверьте:

1. Логи контейнеров: `docker-compose logs`
2. Статус контейнеров: `docker-compose ps`
3. Доступность портов: `netstat -an | grep 8081`
