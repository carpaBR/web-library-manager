const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define para onde vai cada tipo de requisição
router.get('/', bookController.getAllBooks);          // Ver todos os livros
router.post('/', bookController.addBook);             // Cadastrar livro
router.put('/:id/status', bookController.updateBookStatus); // Atualizar status
router.delete('/:id', bookController.deleteBook);     // Excluir livro

module.exports = router;
