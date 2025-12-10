# Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy source
COPY pom.xml .
COPY src ./src

# Build
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy jar
COPY --from=build /app/target/*.jar app.jar

# Port
EXPOSE 8081

# Run as root (no USER directive)
ENTRYPOINT ["java", "-jar", "app.jar"]
