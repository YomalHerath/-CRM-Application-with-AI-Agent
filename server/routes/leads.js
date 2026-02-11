const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all leads
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD lead
router.post('/', async (req, res) => {
    const { name, email, phone, company, status = 'New' } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, company, status]
        );
        res.json({ message: 'Lead added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE lead status
router.put('/', async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.query('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Lead updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE lead
router.delete('/', async (req, res) => {
    const { id } = req.query; // PHP used $_GET['id']
    try {
        await db.query('DELETE FROM leads WHERE id = ?', [id]);
        res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
