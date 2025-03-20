# Node.js Todo API

A RESTful API for managing todos built with Node.js, Express, TypeScript, and Prisma.

## Features

- CRUD operations for todos
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (remote via Neon.tech in this case)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- The `.env` file should contain your database connection string:
```
DATABASE_URL="postgresql://todo-app_owner:npg_0lSY6dWDJBtX@ep-round-resonance-a8y2r9ei-pooler.eastus2.azure.neon.tech/todo-app?sslmode=require"
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Push the database schema:
```bash
npm run prisma:push
```

### Running the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

## API Endpoints

### Todos

| Method | Endpoint       | Description            |
|--------|---------------|------------------------|
| GET    | /api/todos     | Get all todos          |
| GET    | /api/todos/:id | Get a specific todo    |
| POST   | /api/todos     | Create a new todo      |
| PUT    | /api/todos/:id | Update an existing todo|
| DELETE | /api/todos/:id | Delete a todo          |

### Request & Response Examples

#### Create Todo
POST /api/todos

**Request:**
```json
{
  "title": "Complete project",
  "description": "Finish the Node.js Todo API project",
  "completed": false
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the Node.js Todo API project",
  "completed": false,
  "createdAt": "2023-07-12T10:30:00.000Z",
  "updatedAt": "2023-07-12T10:30:00.000Z"
}
```