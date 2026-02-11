const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('CRM API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const leadRoutes = require('./routes/leads');
const profileRoutes = require('./routes/profile');
const activityRoutes = require('./routes/activities');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
