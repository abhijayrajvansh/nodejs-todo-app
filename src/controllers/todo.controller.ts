import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get all todos
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos', error });
  }
};

// Get todo by id
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ message: 'Failed to fetch todo', error });
  }
};

// Create new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        completed: completed || false,
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Failed to create todo', error });
  }
};

// Update todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Check if todo exists
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        title: title !== undefined ? title : todo.title,
        description: description !== undefined ? description : todo.description,
        completed: completed !== undefined ? completed : todo.completed,
      },
    });

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo', error });
  }
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if todo exists
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    // Delete todo
    await prisma.todo.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: `Todo with id ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo', error });
  }
};