import express, { Request, Response, NextFunction } from 'express';
import * as TodoController from '../controllers/todo.controller';

const router = express.Router();

// GET all todos
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  TodoController.getAllTodos(req, res).catch(next);
});

// GET todo by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  TodoController.getTodoById(req, res).catch(next);
});

// POST create new todo
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  TodoController.createTodo(req, res).catch(next);
});

// PUT update todo
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  TodoController.updateTodo(req, res).catch(next);
});

// DELETE todo
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  TodoController.deleteTodo(req, res).catch(next);
});

export default router;