const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Create a new item
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newItem = new Item({ name, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
