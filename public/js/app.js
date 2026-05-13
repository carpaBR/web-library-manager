const API_URL = '/api/books';
const AUTH_URL = '/api/auth';

let allBooks = [];

// =============================================
// AUTENTICAÇÃO — verifica se está logado
// =============================================

// Exibe o nome do usuário logado no header e cria botão de logout
function setupHeader(usuario) {
    const header = document.querySelector('header');
    const userBar = document.createElement('div');
    userBar.id = 'user-bar';
    userBar.innerHTML = `
        <span id="welcome-msg">👤 Olá, <strong>${usuario}</strong></span>
        <button id="btnLogout" onclick="logout()">Sair</button>
    `;
    header.appendChild(userBar);
}

// Faz o logout e redireciona para o login
async function logout() {
    await fetch(`${AUTH_URL}/logout`, { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
}

// Verifica se o usuário está autenticado antes de tudo
async function checkAuth() {
    try {
        const res = await fetch(`${AUTH_URL}/me`, { credentials: 'include' });
        const data = await res.json();
        if (!data.logado) {
            window.location.href = '/login.html';
            return false;
        }
        setupHeader(data.usuario);
        return true;
    } catch (err) {
        window.location.href = '/login.html';
        return false;
    }
}

// =============================================
// LIVROS
// =============================================

async function fetchBooks() {
    try {
        const response = await fetch(API_URL, { credentials: 'include' });
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        allBooks = await response.json();
        renderBooks(allBooks);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        document.getElementById('booksGrid').innerHTML = '<p style="color: red;">Erro ao tentar carregar a biblioteca.</p>';
    }
}

function renderBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        const statusClass = `status-${book.status.replace(/\s+/g, '')}`;

        const imgHtml = book.capa_url ?
            `<img src="${book.capa_url}" alt="Capa" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius) var(--radius) 0 0; background: #eee;">` :
            `<div style="height: 200px; background: #E2E8F0; display:flex; align-items:center; justify-content:center; color: var(--text-muted); border-radius: var(--radius) var(--radius) 0 0;">📚 Sem Capa</div>`;

        const card = document.createElement('div');
        card.className = 'book-card reveal';
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

    observeElements();
}

// Busca de ISBN via API do Google Books
document.getElementById('btnBuscarIsbn').addEventListener('click', async () => {
    const isbnInput = document.getElementById('isbn').value.replace(/\D/g, '');

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

            if (info.title)      document.getElementById('titulo').value = info.title;
            if (info.authors)    document.getElementById('autor').value  = info.authors.join(', ');
            if (info.categories) document.getElementById('genero').value = info.categories[0];

            if (info.imageLinks && info.imageLinks.thumbnail) {
                document.getElementById('capa_url').value = info.imageLinks.thumbnail.replace('http:', 'https:');
            }

            showFeedback('Dados encontrados com sucesso!', 'green');
        } else {
            showFeedback('Nenhum livro encontrado para este ISBN.', '#F59E0B');
        }
    } catch (error) {
        console.error(error);
        showFeedback('Erro na conexão com Google Books.', 'red');
    } finally {
        btn.textContent = textoOriginal;
        btn.disabled = false;
    }
});

// Cadastrar novo livro
document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo   = document.getElementById('titulo').value;
    const autor    = document.getElementById('autor').value;
    const genero   = document.getElementById('genero').value;
    const isbn     = document.getElementById('isbn').value;
    const capa_url = document.getElementById('capa_url').value;
    const status   = document.getElementById('status').value;

    const newBook = { titulo, autor, genero, isbn, capa_url, status };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newBook)
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            document.getElementById('bookForm').reset();
            showFeedback('Livro adicionado com sucesso!', 'green');
            fetchBooks();
        } else {
            showFeedback('Erro ao adicionar.', 'red');
        }
    } catch (error) {
        showFeedback('Erro de comunicação com o servidor.', 'red');
    }
});

// Atualizar status de um livro
async function updateBookStatus(id, newStatus) {
    if (!newStatus) return;
    try {
        await fetch(`${API_URL}/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus })
        });
        fetchBooks();
    } catch (error) {
        alert('Erro ao atualizar status.');
    }
}

// Deletar um livro
async function deleteBook(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.status === 401) { window.location.href = '/login.html'; return; }
            if (res.ok) fetchBooks();
            else alert('Erro do servidor ao tentar deletar o livro.');
        } catch (error) {
            alert('Erro de conexão ao deletar o livro.');
        }
    }
}

// Filtros
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        if (filterValue === 'Todos') {
            renderBooks(allBooks);
        } else {
            renderBooks(allBooks.filter(book => book.status === filterValue));
        }
    });
});

// Feedback visual
function showFeedback(msg, color) {
    const feedback = document.getElementById('form-feedback');
    feedback.textContent = msg;
    feedback.style.color = color;
    setTimeout(() => { feedback.textContent = ''; }, 3000);
}

// Inicialização: primeiro verifica auth, depois carrega livros
checkAuth().then(logado => {
    if (logado) fetchBooks();
    
    // Inicia a observação de elementos estáticos com a classe .reveal
    observeElements();
});

// =============================================
// ANIMAÇÃO DE RENDERIZAÇÃO NO SCROLL (Reveal)
// =============================================
function observeElements() {
    const reveals = document.querySelectorAll('.reveal:not(.observed)');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1, // Dispara quando 10% do elemento estiver visível
        rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes do elemento entrar totalmente
    });

    reveals.forEach(el => {
        el.classList.add('observed');
        observer.observe(el);
    });
}
