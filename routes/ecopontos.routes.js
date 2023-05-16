const express = require('express');
const router = express.Router();
const ecopontoController = require('../controllers/ecopontos.controller');

// Rota para criar um novo Ecoponto
router.post('/ecoponto', ecopontoController.create);

// Rota para obter todos os Ecopontos
router.get('/ecoponto', ecopontoController.findAll);

// Rota para obter um Ecoponto específico por ID
router.get('/ecoponto/:id', ecopontoController.findOne);

// Rota para atualizar um Ecoponto por ID
router.put('/ecoponto/:id', ecopontoController.update);

// Rota para excluir um Ecoponto por ID
router.delete('/ecoponto/:id', ecopontoController.delete);

module.exports = router;
