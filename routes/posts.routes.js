const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo Ecoponto
router.post('/post',authController.verifyToken, postController.create);

// Rota para obter todos os Ecopontos
router.get('/post', postController.findAll);

// Rota para obter um Ecoponto específico por ID
router.get('/post/:id', postController.findOne);

// Rota para atualizar um Ecoponto por ID
router.put('/post/:id', postController.update);


// Rota para excluir um Ecoponto por ID
router.delete('/post/:id',authController.verifyToken, postController.delete);

module.exports = router;
