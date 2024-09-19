# Online Quiz System

## Features

- User registration and login
- Admin functionalities to create, update, and delete quizzes
- Users can view and attempt quizzes
- Scores are calculated and saved.

## Design Decisions

- Used Nest.js for scalability and structure.
- TypeORM for database interaction.
- JWT-based authentication for admin and users.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Ensure Docker and Docker Compose are installed, or install PostgreSQL locally.
4. Configure your database in `.env` file, (you can copy and change the variables from `.env.example`).
5. If using Docker, run the following to start the PostgreSQL container: `docker compose up -d`
6. Run the project in development mode: `npm run start:dev`.

## API Documentation

- Access the Swagger UI for API documentation at http://localhost:3000/api.
