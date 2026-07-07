const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('../backend/routes/auth');
const paymentRoutes = require('../backend/routes/payment');
const bookingRoutes = require('../backend/routes/booking');
const roomRoutes = require('../backend/routes/room');
const settingsRoutes = require('../backend/routes/settings');
const membersRoutes = require('../backend/routes/members');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Normalize incoming URLs: some serverless platforms pass the full
// path including the `/api` prefix (e.g. `/api/room/all`). Strip that
// prefix so mounted routes like `/room` match correctly.
app.use((req, res, next) => {
  if (req.url && req.url.indexOf('/api/') === 0) {
    req.url = req.url.replace(/^\/api/, '');
    if (req.originalUrl) req.originalUrl = req.originalUrl.replace(/^\/api/, '');
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/booking', bookingRoutes);
app.use('/room', roomRoutes);
app.use('/settings', settingsRoutes);
app.use('/members', membersRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running normally' });
});

// Fallback for unknown API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

module.exports = app;
