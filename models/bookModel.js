const db = require('../config/db');

// Modelo: Lida diretamente com o Banco de Dados.
// Isso separa a lógica SQL do resto do sistema.
const Book = {
    // Buscar todos os livros
    getAll: (callback) => {
        db.query('SELECT * FROM livros ORDER BY data_cadastro DESC', callback);
    },

    // Adicionar um novo livro
    create: (bookData, callback) => {
        const query = 'INSERT INTO livros (titulo, autor, genero, isbn, capa_url, status) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [bookData.titulo, bookData.autor, bookData.genero, bookData.isbn, bookData.capa_url, bookData.status], callback);
    },

    // Atualizar o status de um livro (ex: de Lendo para Lido)
    updateStatus: (id, status, callback) => {
        const query = 'UPDATE livros SET status = ? WHERE id = ?';
        db.query(query, [status, id], callback);
    },

    // Deletar um livro
    delete: (id, callback) => {
        const query = 'DELETE FROM livros WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = Book;
