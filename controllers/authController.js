const User = require('../models/userModel');

// Controller de Autenticação

// POST /api/auth/login
exports.login = (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    User.findByCredentials(usuario, senha, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
        }

        const user = results[0];

        // Salva o ID e nome do usuário na sessão
        req.session.userId   = user.id;
        req.session.usuario  = user.usuario;

        return res.json({ message: 'Login realizado com sucesso!', usuario: user.usuario });
    });
};

// POST /api/auth/register
exports.register = (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    User.findByUsername(usuario, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Nome de usuário já está em uso.' });
        }

        User.create(usuario, senha, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao criar usuário.' });
            }

            // Salva o ID e nome do usuário na sessão para logar automaticamente
            req.session.userId   = result.insertId;
            req.session.usuario  = usuario;

            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
        });
    });
};

// POST /api/auth/logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao encerrar a sessão.' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logout realizado com sucesso.' });
    });
};

// GET /api/auth/me - verifica se o usuário está logado
exports.me = (req, res) => {
    if (req.session && req.session.userId) {
        return res.json({ logado: true, usuario: req.session.usuario });
    }
    return res.status(401).json({ logado: false });
};
