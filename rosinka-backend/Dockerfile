# Используем многоэтапную сборку для оптимизации размера образа
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Копируем pom.xml и загружаем зависимости (для кэширования слоя)
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Копируем исходный код
COPY src ./src

# Собираем приложение
RUN mvn clean package -DskipTests

# Финальный образ
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Копируем jar из build stage
COPY --from=build /app/target/*.jar app.jar

# Открываем порт приложения
EXPOSE 8081

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]
