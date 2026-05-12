const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login  — faz o login
router.post('/login', authController.login);

// POST /api/auth/register — cadastra um novo usuário
router.post('/register', authController.register);

// POST /api/auth/logout — faz o logout
router.post('/logout', authController.logout);

// GET  /api/auth/me     — retorna se o usuário está autenticado
router.get('/me', authController.me);

module.exports = router;
