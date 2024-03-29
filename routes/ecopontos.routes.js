const express = require('express');
const router = express.Router();
const ecopontoController = require('../controllers/ecopontos.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo Ecoponto
router.post('/bin',authController.verifyToken, ecopontoController.create);

// Rota para obter todos os Ecopontos
router.get('/bin',authController.verifyToken, ecopontoController.findAll);

// Rota para obter um Ecoponto específico por ID
router.get('/bin/:id',authController.verifyToken, ecopontoController.findOne);

// Rota para atualizar um Ecoponto por ID
router.put('/bin/:id',authController.verifyToken, ecopontoController.update);
router.put('/bin/add/:id', ecopontoController.add);
router.put('/bin/post/:id', authController.verifyToken, ecopontoController.add);

// Rota para excluir um Ecoponto por ID
router.delete('/bin/:id', authController.verifyToken, ecopontoController.delete);

module.exports = router;
