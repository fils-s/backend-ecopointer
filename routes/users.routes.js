const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo usuário
router.post('/user', userController.create);

// Rota para obter todos os usuários
//router.get('/user', userController.findAll);
router.get('/user',authController.verifyToken, userController.findAll);

// Rota para obter um usuário específico por ID
router.get('/user/:id',authController.verifyToken, userController.findOne);

// Rota para atualizar um usuário por ID
router.put('/user/:id',authController.verifyToken, userController.update);

// Rota para excluir um usuário por ID
router.delete('/user/:id',authController.verifyToken, userController.delete);

router.post('/login',userController.login);


module.exports = router;
