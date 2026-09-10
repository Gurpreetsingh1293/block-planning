const express = require('express');
const router = express.Router();
const { login, getMe, getDemoAccounts } = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', getMe);

// GET /api/auth/demo-accounts
router.get('/demo-accounts', getDemoAccounts);

module.exports = router;
