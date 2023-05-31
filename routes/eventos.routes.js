const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventos.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo evento
router.post('/event', authController.verifyToken, eventoController.create);

// Rota para obter todos os eventos
router.get('/event', authController.verifyToken, eventoController.findAll);

// Rota para obter um evento específico por ID
router.get('/event/:id', eventoController.findOne);

// Rota para atualizar um evento por ID
router.put('/event/:id', eventoController.update);

// Rota para excluir um evento por ID
router.delete('/event/:id', authController.verifyToken, eventoController.delete);

module.exports = router;
