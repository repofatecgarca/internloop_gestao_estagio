const db = require('../database.js');

exports.login = (req, res) => {
    const { username, password } = req.body;
    let error = false; // Inicializa a variável error como falso
    if (username && password) {
        db.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], (err, results) => {
            if (err) {
                console.error('Erro interno ao realizar o login:', err);
                error = true; // Define a variável error como verdadeira em caso de erro
                renderLoginPage(); // Renderiza a página de login
            } else {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    // Redireciona para a página de administrador após o login
                    res.redirect('/administrador');
                } else {
                    // Define a variável error como verdadeira se não houver correspondência de login
                    error = true;
                    renderLoginPage(); // Renderiza a página de login
                }
            }
        });
    } else {
        // Define a variável error como verdadeira se não forem fornecidos username e password
        error = true;
        renderLoginPage(); // Renderiza a página de login
    }

    // Função para renderizar a página de login com a variável error
    function renderLoginPage() {
        res.render('login', { error }); // Passa a variável error para o template EJS
    }
};