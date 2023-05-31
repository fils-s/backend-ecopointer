const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqs.controller');
const authController= require('../controllers/auth.controller')

// Rota para criar um novo desafio
router.post('/faq', faqController.create);

// Rota para obter todos os desafios
router.get('/faq', faqController.findAll);

// Rota para obter um desafio específico por ID
router.get('/faq/:id', faqController.findOne);

// Rota para atualizar um desafio por ID
router.put('/faq/:id', faqController.update);

// Rota para excluir um desafio por ID
router.delete('/faq/:id', authController.verifyToken, faqController.delete);

module.exports = router;
