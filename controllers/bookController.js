const Book = require('../models/bookModel');

// Controller: É o intermediário que recebe o pedido,
// pede para o Model fazer o trabalho no banco de dados,
// e então envia a resposta de volta ao Front-end.
exports.getAllBooks = (req, res) => {
    Book.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar livros no banco' });
        }
        res.json(results);
    });
};

exports.addBook = (req, res) => {
    const newBook = req.body;
    
    // Validação básica (permitindo autor vazio)
    if (!newBook.titulo) {
        return res.status(400).json({ error: 'Título é obrigatório' });
    }

    Book.create(newBook, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao salvar o livro' });
        }
        res.status(201).json({ message: 'Livro adicionado com sucesso', id: results.insertId });
    });
};

exports.updateBookStatus = (req, res) => {
    const bookId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status não informado' });
    }

    Book.updateStatus(bookId, status, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar o livro' });
        }
        res.json({ message: 'Status atualizado com sucesso' });
    });
};

exports.deleteBook = (req, res) => {
    const bookId = req.params.id;

    Book.delete(bookId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar o livro' });
        }
        res.json({ message: 'Livro deletado com sucesso' });
    });
};
