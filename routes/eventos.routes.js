const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventos.controller');

// Rota para criar um novo evento
router.post('/evento', eventoController.create);

// Rota para obter todos os eventos
router.get('/evento', eventoController.findAll);

// Rota para obter um evento específico por ID
router.get('/evento/:id', eventoController.findOne);

// Rota para atualizar um evento por ID
router.put('/evento/:id', eventoController.update);

// Rota para excluir um evento por ID
router.delete('/evento/:id', eventoController.delete);

module.exports = router;
