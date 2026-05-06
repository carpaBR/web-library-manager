const API_URL = 'http://localhost:3000/api/books';

let allBooks = []; // Guardará os livros carregados do banco

// Função para buscar livros do Backend (API)
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        allBooks = await response.json();
        renderBooks(allBooks);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        document.getElementById('booksGrid').innerHTML = '<p style="color: red;">Erro ao tentar carregar a biblioteca.</p>';
    }
}

// Função para desenhar os livros na tela de forma visual
function renderBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = ''; // Limpa antes de preencher

    if (books.length === 0) {
        grid.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        // Remove espaços do status para criar o nome da classe CSS (ex: "Quero Ler" vira "QueroLer")
        const statusClass = `status-${book.status.replace(/\s+/g, '')}`;

        const imgHtml = book.capa_url ? 
            `<img src="${book.capa_url}" alt="Capa" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius) var(--radius) 0 0; background: #eee;">` : 
            `<div style="height: 200px; background: #E2E8F0; display:flex; align-items:center; justify-content:center; color: var(--text-muted); border-radius: var(--radius) var(--radius) 0 0;">📚 Sem Capa</div>`;

        const card = document.createElement('div');
        card.className = 'book-card';
        // Reduzimos o padding para a imagem colar nas bordas
        card.style.padding = '0'; 
        card.innerHTML = `
            ${imgHtml}
            <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                <div class="book-title">${book.titulo}</div>
                <div class="book-author">por ${book.autor}</div>
                <div class="book-genre">${book.genero || 'Sem gênero'}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">ISBN: ${book.isbn || 'N/A'}</div>
                
                <div class="book-status" style="margin-top: auto;">
                    <span class="status-badge ${statusClass}">${book.status}</span>
                    
                    <select class="update-status-select" onchange="updateBookStatus(${book.id}, this.value)">
                        <option value="">Alterar Status</option>
                        <option value="Quero Ler">Quero Ler</option>
                        <option value="Lendo">Lendo</option>
                        <option value="Lido">Lido</option>
                        <option value="Emprestado">Emprestado</option>
                    </select>
                    
                    <button class="delete-btn" onclick="deleteBook(${book.id})">Excluir</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Busca de ISBN via API do Google Books
document.getElementById('btnBuscarIsbn').addEventListener('click', async () => {
    const isbnInput = document.getElementById('isbn').value.replace(/\D/g, ''); // Apenas números
    
    if (!isbnInput) {
        showFeedback('Por favor, digite um ISBN válido.', 'red');
        return;
    }

    const btn = document.getElementById('btnBuscarIsbn');
    const textoOriginal = btn.textContent;
    btn.textContent = 'Buscando...';
    btn.disabled = true;

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnInput}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const info = data.items[0].volumeInfo;
            
            // Preenche os campos caso a API retorne os dados
            if (info.title) document.getElementById('titulo').value = info.title;
            if (info.authors) document.getElementById('autor').value = info.authors.join(', ');
            if (info.categories) document.getElementById('genero').value = info.categories[0];
            
            if (info.imageLinks && info.imageLinks.thumbnail) {
                // Trocamos http por https para evitar erros
                document.getElementById('capa_url').value = info.imageLinks.thumbnail.replace('http:', 'https:');
            }
            
            showFeedback('Dados encontrados com sucesso!', 'green');
        } else {
            showFeedback('Nenhum livro encontrado para este ISBN.', '#F59E0B'); // cor de aviso (laranja)
        }
    } catch (error) {
        console.error(error);
        showFeedback('Erro na conexão com Google Books.', 'red');
    } finally {
        btn.textContent = textoOriginal;
        btn.disabled = false;
    }
});

// Função para cadastrar novo livro
document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recarregar a página
    
    // Pega os dados que o usuário digitou
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const isbn = document.getElementById('isbn').value;
    const capa_url = document.getElementById('capa_url').value;
    const status = document.getElementById('status').value;

    const newBook = { titulo, autor, genero, isbn, capa_url, status };

    try {
        // Envia para o Back-end
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            document.getElementById('bookForm').reset(); // Limpa form
            showFeedback('Livro adicionado com sucesso!', 'green');
            fetchBooks(); // Recarrega a lista
        } else {
            showFeedback('Erro ao adicionar.', 'red');
        }
    } catch (error) {
        showFeedback('Erro de comunicação com o servidor.', 'red');
    }
});

// Atualizar o status de um livro
async function updateBookStatus(id, newStatus) {
    if (!newStatus) return;

    try {
        await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchBooks(); // Recarrega para mostrar a nova cor e status
    } catch (error) {
        alert('Erro ao atualizar status.');
    }
}

// Deletar um livro
async function deleteBook(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                fetchBooks();
            } else {
                alert('Erro do servidor ao tentar deletar o livro. Tente reiniciar a API.');
            }
        } catch (error) {
            alert('Erro de conexão ao deletar o livro.');
        }
    }
}

// Filtros da interface
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a classe active de todos e bota no clicado
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        if (filterValue === 'Todos') {
            renderBooks(allBooks);
        } else {
            // Conta com Filter do Array (Simples e eficiente)
            const filtered = allBooks.filter(book => book.status === filterValue);
            renderBooks(filtered);
        }
    });
});

// Mostrar mensagem rápida para o usuário
function showFeedback(msg, color) {
    const feedback = document.getElementById('form-feedback');
    feedback.textContent = msg;
    feedback.style.color = color;
    setTimeout(() => {
        feedback.textContent = '';
    }, 3000);
}

// Quando a tela carregar pela primeira vez, busca os livros
fetchBooks();
