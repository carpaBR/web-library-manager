const db = require('../config/db');

// Modelo de Usuário: lida com o banco de dados para autenticação
const User = {

    // Busca um usuário pelo nome de usuario e senha (comparação direta, sem criptografia)
    findByCredentials: (usuario, senha, callback) => {
        const query = 'SELECT id, usuario FROM usuarios WHERE usuario = ? AND senha = ?';
        db.query(query, [usuario, senha], callback);
    },

    // Cria um novo usuário
    create: (usuario, senha, callback) => {
        const query = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
        db.query(query, [usuario, senha], callback);
    },

    // Verifica se um nome de usuário já existe
    findByUsername: (usuario, callback) => {
        const query = 'SELECT id FROM usuarios WHERE usuario = ?';
        db.query(query, [usuario], callback);
    }
};

module.exports = User;
