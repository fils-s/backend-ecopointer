const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafios.controller');

// Rota para criar um novo desafio
router.post('/desafio', desafioController.create);

// Rota para obter todos os desafios
router.get('/desafio', desafioController.findAll);

// Rota para obter um desafio específico por ID
router.get('/desafio/:id', desafioController.findOne);

// Rota para atualizar um desafio por ID
router.put('/desafio/:id', desafioController.update);

// Rota para excluir um desafio por ID
router.delete('/desafio/:id', desafioController.delete);

module.exports = router;
