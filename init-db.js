const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log('Iniciando o instalador automático do Banco de Dados...');

// Conecta ao MySQL SEM informar um banco específico, para podermos criá-lo!
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    multipleStatements: true // Permite executar várias linhas SQL de uma vez
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erro de conexão com o MySQL:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Acesso ao seu MySQL confirmado. Lendo o arquivo database.sql...');
    
    const sqlFile = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');
    
    // Executa tudo de uma vez
    connection.query(sqlContent, (err, results) => {
        connection.end(); // Fecha a conexão
        
        if (err) {
            console.error('❌ Erro ao criar as tabelas ou banco. Detalhe:', err.message);
            process.exit(1);
        }
        
        console.log('🎉 BANCO DE DADOS E TABELAS CRIADOS COM SUCESSO!');
        console.log('👤 Usuário padrão criado  → usuario: admin  |  senha: 1234');
        console.log('👉 Agora você pode digitar: npm start');
        console.log('🌐 Acesse: http://localhost:3000/login.html');
        process.exit(0);
    });
});
