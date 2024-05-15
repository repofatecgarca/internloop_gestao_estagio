// npm install bcrypt body-parser cors ejs express express-session mysql path

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const methodOverride = require('method-override')
const userRoutes = require('./routes/users')
const { getUsers } = require('./controllers/user')
const { login } = require('./controllers/login')
const flash = require('express-flash')
require('dotenv').config()
const port = process.env.PORT || 3333
const app = express()

app.use(
    session({
      secret: 'sua-chave-secreta', // Use uma chave secreta segura
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Para ambientes sem HTTPS
    })
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(flash());
app.use(methodOverride('_method'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use('/public', express.static(path.join(__dirname, 'views/public')));

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login.html');
});

// Rota para o processamento do login
app.post('/login', login);

// Rota para a página do administrador
app.get('/administrador', getUsers);

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
