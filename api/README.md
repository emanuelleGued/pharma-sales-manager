# Back-end setup

1. Start PostgreSQL with Docker

   At the root of the project, run:
   ```bash
   docker compose up -d
   ```

2. Enter the API folder:
   ```bash
   cd api
   ```

3. Start the Spring Boot API:
   ```bash
   mvn spring-boot:run
   ```
   The API will run on:
   ```txt
   http://localhost:8080
   ```
# Database Configuration

The PostgreSQL database runs with Docker using the following default configuration:
```yml
spring:
datasource:
   url: jdbc:postgresql://localhost:5432/pharma_sales
   username: postgres
   password: postgres
```