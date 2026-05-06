CREATE DATABASE IF NOT EXISTS biblioteca_pessoal;

USE biblioteca_pessoal;

CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    genero VARCHAR(100),
    isbn VARCHAR(20),
    status ENUM('Lido', 'Lendo', 'Quero Ler', 'Emprestado') DEFAULT 'Quero Ler',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo alguns dados de teste para começar
INSERT INTO livros (titulo, autor, genero, isbn, status) VALUES 
('1984', 'George Orwell', 'Ficção Distópica', '9788535914849', 'Lido'),
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', '9788595084742', 'Quero Ler'),
('A Arte da Guerra', 'Sun Tzu', 'Estratégia', '9788520448151', 'Lendo');
