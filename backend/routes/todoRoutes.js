const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const { validateTodo } = require('../validator/todoValidator');

// add new todo api 
router.post('/add', async (req, res) => {
    try {
        const errors = validateTodo(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        const { title, description, date, priority, expireAt } = req.body;
        const status = expireAt && new Date(expireAt) < new Date() ? "Expired" : "Pending";
        const newTodo = new Todo({
            title,
            description,
            date,
            priority,
            expireAt,
            status
        })
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' })
    }
})

// all todos api
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ date: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router;
