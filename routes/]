const express = require('express');
const db = require('../database.js');
const { getUsers, registerCoordinator, addUser, updateUser, deleteUser, detalhesCoordenador, getCompany, registerCompany, addCompany, getAluno, registerAluno} = require('../controllers/user.js');

const router = express.Router();

router.get('/administrador', getUsers);

router.get('/administrador/cadastrar', registerCoordinator);
router.post('/administrador/cadastrar', addUser);

router.put('/administrador/editar/:id', updateUser);

router.get('/administrador/editar/:id', (req, res) => {
    const id = req.params.id; // Pegando o ID da rota

    // Consulta para buscar o coordenador pelo ID
    db.query('SELECT * FROM coordenadores WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar coordenador', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Coordenador não encontrado' });
        }

        const coordenador = results[0]; // Pegando o primeiro resultado

        // Renderizando a visualização EJS com dados do coordenador
        res.render('editarCoordenador', { coordenador }); // 'editarCoordenador' é o nome do arquivo EJS
    });
});

router.delete('/administrador/excluir/:id', deleteUser);

router.get('/administrador/detalhe/:id', detalhesCoordenador);

// ==================================================

router.get('/empresa', getCompany);

router.get('/empresa/cadastrar', registerCompany);
router.post('/empresa/cadastrar', addCompany);

// ==================================================

router.get('/coordenador', getAluno);

router.get('/coordenador/cadastrar', registerAluno);


module.exports = router;
