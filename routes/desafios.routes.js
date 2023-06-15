const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafios.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo desafio
router.post('/challenge',authController.verifyToken, desafioController.create);

// Rota para obter todos os desafios
router.get('/challenge', desafioController.findAll);

// Rota para obter um desafio específico por ID
router.get('/challenge/:id', desafioController.findOne);

// Rota para atualizar um desafio por ID
router.put('/challenge/:id', desafioController.update);

// Rota para excluir um desafio por ID
router.delete('/challenge/:id', authController.verifyToken, desafioController.delete);

module.exports = router;
