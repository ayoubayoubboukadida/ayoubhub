// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());

// CORS - allow frontend domain (set in env)
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ayoubhub.netlify.app';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Sessions
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Render uses HTTPS; set true if behind TLS and trusting proxy
}));

// connect mongo
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ayoubhub';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB:', MONGODB_URI))
  .catch(err => console.error('Mongo connection error:', err));

// routes
app.use('/user', authRoutes);
app.use('/payments', paymentsRoutes);
app.use('/notifications', notificationsRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`CORS allowed origin: ${FRONTEND_URL}`);
});
