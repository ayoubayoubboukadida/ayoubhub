// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/Payment');

const PI_API_KEY = process.env.PI_API_KEY || ''; // set in env

// Example: when frontend notifies payment ready for approval
router.post('/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

    // Here you would call Pi backend API to approve using PI_API_KEY
    // Example (pseudo):
    // await axios.post(`https://api.minepi.com/v1/payments/${paymentId}/approve`, {}, { headers: { 'Authorization': `Bearer ${PI_API_KEY}` } });

    console.log('Approve payment', paymentId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    console.log('Complete payment', paymentId, txid);
    // save to DB record
    await Payment.create({ paymentId, amount: 0, memo: '', metadata: { txid }, status: { completed: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/incomplete', async (req, res) => {
  try {
    const { payment } = req.body;
    if (!payment) return res.status(400).json({ error: 'Missing payment' });
    await Payment.create({ paymentId: payment.identifier || payment.id, amount: payment.amount || 0, memo: payment.memo || '', metadata: payment });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
