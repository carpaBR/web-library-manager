// Middleware de Autenticação
// Verifica se o usuário está logado antes de permitir acesso às rotas protegidas

function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next(); // Usuário autenticado, continua
    }
    // Não autenticado: retorna erro 401
    return res.status(401).json({ error: 'Acesso negado. Faça login para continuar.' });
}

module.exports = requireLogin;
