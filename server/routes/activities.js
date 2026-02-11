const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [leads] = await db.query('SELECT count(*) as count FROM leads');
        const [events] = await db.query('SELECT count(*) as count FROM events');
        const [users] = await db.query('SELECT count(*) as count FROM users');

        const [books] = await db.query("SELECT count(*) as count FROM events WHERE source='voice_ai'");
        const [tasks] = await db.query("SELECT count(*) as count FROM events WHERE source='voice_ai' AND (calendar='task' OR title LIKE '%Task%')");

        const voice_stats = {
            books_submitted: books[0].count || 0,
            tasks_completed: tasks[0].count || 0,
            active_calls: 0
        };

        res.json({
            leads: leads[0].count,
            events: events[0].count,
            users: users[0].count,
            voice_agent: voice_stats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
