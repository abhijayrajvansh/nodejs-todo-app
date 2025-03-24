# Backend Development Assignment: Todo API

## Overview
Create a RESTful API for a Todo application using modern backend development practices and technologies. This assignment will test your ability to create a well-structured Node.js application with TypeScript, implement database operations using Prisma ORM, and follow RESTful API design principles.

## Technical Requirements

### Required Technologies
- Node.js (v14 or higher)
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Git

### Project Structure
Your project must follow this exact structure for consistency and maintainability:
```
├── src/
│   ├── index.ts                # Application entry point
│   ├── controllers/            # Business logic
│   │   └── todo.controller.ts
│   ├── routes/                # API route definitions
│   │   └── todo.routes.ts
│   └── lib/                   # Shared utilities
│       └── prisma.ts          # Prisma client instance
├── prisma/
│   └── schema.prisma          # Database schema
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## Database Schema Requirements

Implement a Todo model in Prisma with the following fields:
- `id`: Int (Primary Key, Auto-increment)
- `title`: String (Required)
- `description`: String (Optional)
- `completed`: Boolean (Required, Default: false)
- `createdAt`: DateTime (Required, Default: now)
- `updatedAt`: DateTime (Required, Updated automatically)

## API Requirements

### Endpoints

Implement the following RESTful endpoints:

1. **GET /api/todos**
   - Retrieve all todos
   - Should support pagination (optional)
   - Response: Array of todo objects

2. **GET /api/todos/:id**
   - Retrieve a specific todo by ID
   - Should return 404 if todo not found
   - Response: Single todo object

3. **POST /api/todos**
   - Create a new todo
   - Required fields in request body: title
   - Optional fields: description, completed
   - Response: Created todo object

4. **PUT /api/todos/:id**
   - Update an existing todo
   - Should return 404 if todo not found
   - Request body can contain: title, description, completed
   - Response: Updated todo object

5. **DELETE /api/todos/:id**
   - Delete a todo by ID
   - Should return 404 if todo not found
   - Response: Success message

### API Response Formats

All API responses should follow this structure:

For successful operations:
```json
{
  "id": number,
  "title": string,
  "description": string | null,
  "completed": boolean,
  "createdAt": string (ISO date),
  "updatedAt": string (ISO date)
}
```

For errors:
```json
{
  "error": string,
  "statusCode": number
}
```

## Technical Implementation Requirements

### TypeScript
- Strict type checking must be enabled
- Create proper interfaces/types for all data structures
- Use type annotations for all functions and variables

### Prisma Setup
- Use Prisma for database operations
- Implement proper error handling for database operations
- Set up proper database migrations

### Error Handling
- Implement proper error handling middleware
- Use appropriate HTTP status codes
- Return meaningful error messages

### Code Quality Requirements
- Follow REST API best practices
- Use async/await for asynchronous operations
- Implement proper input validation
- Use proper HTTP status codes
- Follow TypeScript best practices

## Evaluation Criteria

Your assignment will be evaluated based on:
1. Code organization and structure
2. Proper implementation of TypeScript features
3. Database schema design and implementation
4. API design and implementation
5. Error handling
6. Code quality and best practices
7. Documentation

## Bonus Points

- Implement API documentation using Swagger/OpenAPI
- Add request validation using a validation library (e.g., Zod, Joi)
- Implement unit tests
- Add authentication/authorization
- Implement filtering and sorting for the GET /todos endpoint

## Submission Requirements

1. Push your code to a public GitHub repository
2. Include a README.md with:
   - Setup instructions
   - API documentation
   - Any additional features implemented
3. Ensure the code is well-commented
4. Include example API requests and responses in the documentation

## Time Allocation
- Recommended time: 4-6 hours
- Maximum time: 2 days

Good luck with your implementation!