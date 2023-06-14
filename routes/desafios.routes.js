const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafios.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo desafio
router.post('/challenges', desafioController.create);

// Rota para obter todos os desafios
router.get('/challenges', desafioController.findAll);

// Rota para obter um desafio específico por ID
router.get('/challenges/:id', desafioController.findOne);

// Rota para atualizar um desafio por ID
router.put('/challenges/:id', desafioController.update);

// Rota para excluir um desafio por ID
router.delete('/challenges/:id', authController.verifyToken, desafioController.delete);

module.exports = router;
