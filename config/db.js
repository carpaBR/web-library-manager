const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MySQL / MariaDB
// Lembre-se preencher a senha correta se houver!
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Troque pela senha do seu banco de dados, se houver
    database: 'biblioteca_pessoal'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados. Verifique a senha e o nome do banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

module.exports = connection;
