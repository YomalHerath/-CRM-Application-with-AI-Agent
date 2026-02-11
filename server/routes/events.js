const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all events
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD or UPDATE event
router.post('/', async (req, res) => {
    const { id, title, start, end, description, calendar = 'Primary', source = 'web' } = req.body;

    let endDate = end;
    if (!endDate) {
        // Default to 1 hour after start
        const startDate = new Date(start);
        startDate.setHours(startDate.getHours() + 1);
        endDate = startDate.toISOString();
    }

    try {
        if (id) {
            // Update
            await db.query(
                'UPDATE events SET title=?, start_date=?, end_date=?, description=?, calendar=?, source=? WHERE id=?',
                [title, start, endDate, description, calendar, source, id]
            );
            res.json({ message: 'Event updated successfully' });
        } else {
            // Create
            const [result] = await db.query(
                'INSERT INTO events (title, start_date, end_date, description, calendar, source) VALUES (?, ?, ?, ?, ?, ?)',
                [title, start, endDate, description, calendar, source]
            );
            res.json({ message: 'Event added successfully', id: result.insertId });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
