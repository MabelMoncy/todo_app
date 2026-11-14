const Todo = require('../models/Todo');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

// Helper to ensure database is ready
const ensureDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

const isDbReady = () => mongoose.connection.readyState === 1;

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res) => {
  try {
    await ensureDB();
    if (!isDbReady()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please add your MongoDB password in server/.env',
        data: []
      });
    }

    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('getTodos error:', error);
    return res.status(500).json({
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

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 200 characters'
      });
    }

    await ensureDB();
    if (!isDbReady()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please add your MongoDB password in server/.env'
      });
    }

    const newTodo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false
    });

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });
  } catch (error) {
    console.error('createTodo error:', error);
    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    await ensureDB();
    if (!isDbReady()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please add your MongoDB password in server/.env'
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }
      todo.title = title.trim();
    }
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = Boolean(completed);

    const updatedTodo = await todo.save();

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    console.error('updateTodo error:', error);
    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    await ensureDB();
    if (!isDbReady()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not ready. Please add your MongoDB password in server/.env'
      });
    }

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
      id
    });
  } catch (error) {
    console.error('deleteTodo error:', error);
    return res.status(500).json({
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
