const express = require('express');
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = 3000;

// Configuração simples para iniciantes entenderem
app.use(cors()); // Permite requisições de outros locais
app.use(express.json()); // Permite que a API receba dados no formato JSON

// Servir os arquivos Frontend estáticos (HTML, CSS, JS) na raiz
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da nossa API (Backend)
app.use('/api/books', bookRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
