// backend/routes/notifications.js
const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
  // payload { notifications: [...] } from frontend
  console.log('Notification request', req.body);
  // here you could enqueue/send via Pi service or save
  res.json({ ok: true });
});

module.exports = router;
