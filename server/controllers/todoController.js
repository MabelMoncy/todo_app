const mongoose = require('mongoose');
const Todo = require('../models/Todo');

// In-memory fallback if MongoDB is not connected yet
let memoryTodos = [
  {
    _id: 'mock-task-1',
    title: 'Welcome to MERN Todo App!',
    description: 'Connect your MongoDB Atlas URI in server/.env to persist tasks.',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-task-2',
    title: 'Verify /name endpoint',
    description: 'Visit /name to see developer verification.',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res) => {
  try {
    if (isDbConnected()) {
      const todos = await Todo.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: todos.length,
        data: todos,
        source: 'database'
      });
    }

    // In-memory fallback
    return res.status(200).json({
      success: true,
      count: memoryTodos.length,
      data: [...memoryTodos].reverse(),
      source: 'memory'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch todos',
      error: error.message
    });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (isDbConnected()) {
      const newTodo = await Todo.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: false
      });

      return res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo,
        source: 'database'
      });
    }

    // In-memory fallback
    const newTodo = {
      _id: 'mock-' + Date.now(),
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryTodos.push(newTodo);

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully (in-memory mode)',
      data: newTodo,
      source: 'memory'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to create todo',
      error: error.message
    });
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (isDbConnected()) {
      const todo = await Todo.findById(id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      if (title !== undefined) todo.title = title.trim();
      if (description !== undefined) todo.description = description.trim();
      if (completed !== undefined) todo.completed = Boolean(completed);

      const updatedTodo = await todo.save();

      return res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo,
        source: 'database'
      });
    }

    // In-memory fallback
    const index = memoryTodos.findIndex((t) => t._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    if (title !== undefined) memoryTodos[index].title = title.trim();
    if (description !== undefined) memoryTodos[index].description = description.trim();
    if (completed !== undefined) memoryTodos[index].completed = Boolean(completed);
    memoryTodos[index].updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: memoryTodos[index],
      source: 'memory'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to update todo',
      error: error.message
    });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const todo = await Todo.findById(id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      await Todo.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
        id,
        source: 'database'
      });
    }

    // In-memory fallback
    const index = memoryTodos.findIndex((t) => t._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    memoryTodos.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      id,
      source: 'memory'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to delete todo',
      error: error.message
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
