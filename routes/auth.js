// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// signin: frontend sends authResult (from Pi SDK)
router.post('/signin', async (req, res) => {
  try {
    const { authResult } = req.body;
    if (!authResult || !authResult.user) return res.status(400).json({ error: 'Missing authResult' });

    const userData = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      roles: authResult.user.roles || [],
      accessToken: authResult.accessToken || ''
    };

    // upsert user
    const user = await User.findOneAndUpdate({ uid: userData.uid }, userData, { upsert: true, new: true });
    // store minimal session
    req.session.user = { uid: user.uid, username: user.username };
    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/signout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
