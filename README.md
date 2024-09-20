# Online Quiz System - Built with Nest.js, TypeORM, Redis, and PostgreSQL

## Features

- User registration and login
- Admin functionalities to create, update, and delete quizzes
- Users can view and attempt quizzes
- Scores are calculated and saved.

## Design Decisions

- Used Nest.js for scalability and structure.
- TypeORM for database interaction.
- JWT-based stateless authentication for admin and users with refresh token functionality for improved security.
- Redis for Token Rotation (invalidate refresh token after using it to generate a new token), enhancing security.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Ensure Docker and Docker Compose are installed, or install PostgreSQL and Redis locally.
4. Configure your database and Redis in `.env` file, (you can copy and change the variables from `.env.example`).
5. If using Docker, run the following to start the PostgreSQL and Redis container: `docker compose up -d`.
6. Run database migrations to create tables: `npm run migration:run`.
7. Run the project in development mode: `npm run start:dev`.

## Database Migration Setup

- Generate a new migration: To create a new migration after making changes to your entities, use: `npm run migration:generate --name=MigrationName`.
- Run migrations: To apply all pending migrations to the database, run: `npm run migration:run`.
- Revert the last migration: If you need to undo the most recent migration, use: `npm run migration:revert`.
- Show migration status: To check the list of applied and pending migrations, run: `npm run migration:show`.

## API Documentation

- Access the Swagger UI for API documentation at http://localhost:3000/api.
