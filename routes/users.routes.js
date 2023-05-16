const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

// Rota para criar um novo usuário
router.post('/user', userController.create);

// Rota para obter todos os usuários
router.get('/user', userController.findAll);

// Rota para obter um usuário específico por ID
router.get('/user/:id', userController.findOne);

// Rota para atualizar um usuário por ID
router.put('/user/:id', userController.update);

// Rota para excluir um usuário por ID
router.delete('/user/:id', userController.delete);


module.exports = router;
