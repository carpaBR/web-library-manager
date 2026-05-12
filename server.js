const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const requireLogin = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Middlewares básicos
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Configuração da Sessão (armazenada na memória do servidor)
app.use(session({
    secret: 'biblioteca-secret-key', // chave para assinar o cookie de sessão
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2 // sessão expira em 2 horas
    }
}));

// Servir os arquivos Frontend estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas públicas (não precisam de login)
app.use('/api/auth', authRoutes);

// Rotas protegidas (precisam de login)
app.use('/api/books', requireLogin, bookRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
