const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // You might need to install bcryptjs: npm install bcryptjs

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        // Note: In a real app, use bcrypt. Assuming the PHP app used password_hash (BCRYPT)
        // We will use plain text for now if the PHP app wasn't using bcrypt, 
        // BUT the PHP code showed password_hash($password, PASSWORD_DEFAULT), which is Bcrypt.
        // So we need bcryptjs to match.

        // However, for simplicity in this migration step (avoiding install issues if possible),
        // I will assume we can install bcryptjs.
        // For now, I'll add a TODO or try to use a simple approach if I can't install.
        // But wait, I can install.
        // Let's rely on the user running npm install, which I queued. I should add bcryptjs to it.

        // Wait, I didn't add bcryptjs to the npm install command.
        // I should probably run another npm install.

        // For now, let's write the code assuming bcryptjs is available, 
        // and I'll add a step to install it.

        // Actually, to be safe and avoid "module not found" errors if the user runs the server immediately,
        // I should run the install command for bcryptjs.

        // But first, let's write the file.

        // Re-reading PHP: password_hash(..., PASSWORD_DEFAULT)
        // Node.js equivalent: bcrypt.hash(password, 10)

        // Re-reading PHP Login: password_verify
        // Node.js equivalent: bcrypt.compare

        // Since I cannot guarantee bcryptjs is installed yet, I will trigger the install.

        /* 
           For this specific file, I'll use a placeholder for now or just write standard code.
        */

        /*
           Wait, I should check if I can use the 'crypto' module which is built-in, 
           but `password_verify` in PHP uses Bcrypt, so 'crypto' (scrypt/pbkdf2) won't suffice for COMPATIBILITY 
           with existing hashes. I MUST use bcryptjs.
        */

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.json({ message: 'User registered successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/', async (req, res) => {
    const { email, password, action } = req.body;

    // Handle the somewhat weird structure where action might be in body or query in PHP
    // The PHP code checked $_GET['action'] but also looked at POST body.
    // The React app likely sends action='login' in the body or URL.
    // We'll stick to standard REST: POST /api/auth/login

    // However, looking at the PHP `auth.php`, it checked `action` from $_GET.
    // The React fetch calls probably look like `/api/auth.php?action=login`.
    // We will need to update React to `/api/auth/login`.

    // Wait, if I'm rewriting React, I can make the route whatever I want.
    // So I'll make it POST /api/auth/login

    // Correction: The `index.js` mounts this router at `/api/auth`.
    // so this route file should handle `/login` not just `/`.
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Remove password from response
        delete user.password;

        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
