const express = require("express");
const router = express.Router();
const { validateTodo } = require("../validator/todoValidator");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { TodoStatus } = require("../enums/todoStatus");
const Todo = require("../model/todoModel");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const errors = validateTodo(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    const { title, description, date, priority, expireAt } = req.body;
    const status =
      expireAt && new Date(expireAt) < new Date()
        ? TodoStatus.Expired
        : TodoStatus.Pending;

    const newTodo = await Todo.create({
      title,
      description,
      date,
      priority,
      expireAt,
      status,
      userId: req.user.id,
    });

    res.status(200).json({
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//todo list API
router.get("/", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalTodos = await Todo.count({
      where: { userId: req.user.id },
    });
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
      order: [["date", "DESC"]],
      limit,
      skip,
    });
    res.json({
      todos,
      currentPage: page,
      totalPages: Math.ceil(totalTodos / limit),
      totalTodos,
      hasNextPage: page * limit < totalTodos,
      hasPreviousPage: page > 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//edit todo api
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const errors = validateTodo(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, description, date, priority, expireAt, completed, status } =
      req.body;
    const updatedStatus =
      status ||
      (expireAt && new Date(expireAt) < new Date() ? "Expired" : "Pending");

    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found " });
    }
    todo.title = title;
    todo.description = description;
    todo.date = date;
    todo.priority = priority;
    todo.expireAt = expireAt;
    todo.completed = completed;
    todo.status = status;

    await todo.save();
    res.status(200).json({
      message: "Todo updated successfully",
      todo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//delete todo api
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    const deletedTodo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await deletedTodo.destroy();
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
