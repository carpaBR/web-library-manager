const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'univesp',
    database: 'biblioteca_pessoal',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error('Erro de conexão:', err.message);
        process.exit(1);
    }
    
    // Adiciona a coluna capa_url (sem IF NOT EXISTS pois o MySQL antigo nao aceita)
    const sql = `ALTER TABLE livros ADD COLUMN capa_url VARCHAR(1000);`;
    
    connection.query(sql, (err, results) => {
        if (err) {
            // MariaDB might not support ADD COLUMN IF NOT EXISTS in all old versions, but let's try a fallback
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.error('Erro ao adicionar coluna:', err.message);
            }
        }
        console.log('Migração concluída.');
        process.exit(0);
    });
});
