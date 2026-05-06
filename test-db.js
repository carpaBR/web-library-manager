const mysql = require('mysql2');
const dbConfig = require('./config/db'); // Importa sua configuração

console.log('⏳ Testando conexão com o Banco de Dados...');

// 1. Testa pegar qual banco estamos conectados
dbConfig.query("SELECT DATABASE() as banco", (err, results) => {
    if (err) {
        console.error('❌ Erro na conexão:', err.message);
        process.exit(1);
    }
    
    console.log(`✅ Conectado com sucesso no banco: ${results[0].banco}`);

    // 2. Testa se a tabela de livros existe
    dbConfig.query("SHOW TABLES LIKE 'livros'", (err, tables) => {
        if (err) {
            console.error('❌ Erro ao buscar tabelas:', err.message);
            process.exit(1);
        }

        if (tables.length === 0) {
            console.error('❌ ATENÇÃO: A tabela "livros" não foi encontrada. Você tem certeza que executou o arquivo database.sql no MySQL Workbench/XAMPP?');
            process.exit(1);
        }

        console.log('✅ A tabela "livros" foi encontrada com sucesso!');

        // 3. Verifica se tem os 3 livros iniciais (que estão lá no script database.sql)
        dbConfig.query("SELECT * FROM livros", (err, livros) => {
            if (err) {
                console.error('❌ Erro ao ler a tabela:', err.message);
                process.exit(1);
            }
            
            console.log(`✅ A tabela tem ${livros.length} livros cadastrados atualmente.`);
            console.log('📌 Lista rápida dos livros:', livros.map(l => l.titulo));
            
            console.log('\n🎉 O BANCO DE DADOS ESTÁ 100% FUNCIONANDO! Pressione Ctrl + C para fechar este teste e rode o npm start novamente.');
            process.exit(0);
        });
    });
});
