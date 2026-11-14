const Todo = require('../models/Todo');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
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

    const newTodo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
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

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
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

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    await Todo.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      id
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
