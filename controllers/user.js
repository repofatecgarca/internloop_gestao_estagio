const db = require('../database.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generatePassword() {
    return crypto.randomBytes(8).toString('hex');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Substitua pelo seu serviço de SMTP
    port: 465,
    secure: true, // true para 465, false para outros ports
    auth: {
        user: 'sannts16@gmail.com', // Substitua pelo seu e-mail
        pass: 'wisv ooai tshs abzm' // Substitua pela sua senha
    }
});

exports.getUsers = (req, res) => {
    db.query('SELECT * FROM coordenadores', (error, results) => {
        if (error) {
            res.status(500).send('Erro interno ao buscar os coordenadores.');
        } else {
            res.render('paginaAdministrador', { coordenadores: results });
        }
    });
};

exports.registerCoordinator = (req, res) => {
    res.render('cadastrarCoordenador')
}

exports.addUser = (req, res) => {
    const password = generatePassword(); // Gera uma senha aleatória
    

    // Insere o novo coordenador na tabela de coordenadores
    const coordinatorValues = [
        req.body.cpf,
        req.body.nome,
        req.body.sobrenome,
        req.body.numMatricula,
        req.body.email,
        req.body.telefone,
        req.body.cursoResponsavel
    ];
    
    const insertCoordinatorQuery = 'INSERT INTO coordenadores (`cpf`, `nome`, `sobrenome`, `numMatricula`, `email`, `telefone`, `cursoResponsavel`) VALUES(?)';

    db.query(insertCoordinatorQuery, [coordinatorValues], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar coordenador:', err);
            return res.status(500).send('Erro ao cadastrar coordenador.');
        } else {
            const loginValues = [req.body.cpf, password];
            const insertLoginQuery = 'INSERT INTO login (`username`, `password`) VALUES(?)';

            db.query(insertLoginQuery, [loginValues], (err, loginResults) => {
                if (err) {
                    console.error('Erro ao cadastrar login:', err);
                    return res.status(500).send('Erro ao cadastrar login.');
                } else {
                    const mailOptions = {
                        from: 'seuemail@gmail.com', // Seu e-mail
                        to: req.body.email, // E-mail do coordenador/aluno
                        subject: 'Informações de Acesso ao Sistema de Estágio',
                        text: `
                            Olá ${req.body.nome},
                            
                            Seu acesso ao sistema de estágio foi criado.
                            Nome de usuário: ${req.body.cpf}
                            Senha temporária: ${password}
                            
                            Por favor, altere sua senha após o primeiro login.
                            
                            Obrigado,
                            Sua Equipe de Suporte
                        `
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log('Erro ao enviar e-mail:', error);
                        } else {
                            console.log('Email enviado: ' + info.response);
                        }
                    });
                    res.redirect('/administrador');
                }
            });
        }
    });
};

exports.updateUser = (req, res) => {
    const q = 'UPDATE coordenadores SET `cpf` = ?, `nome` = ?, `sobrenome` = ?, `numMatricula` = ?, `email` = ?, `telefone` = ?, `cursoResponsavel` = ? WHERE `id` = ?';

    const values = [
        req.body.cpf,
        req.body.nome,
        req.body.sobrenome,
        req.body.numMatricula,
        req.body.email,
        req.body.telefone,
        req.body.cursoResponsavel,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar coordenador', error: err }); // Detalhes de erro para depuração
        }
        return res.json({ message: 'Atualização bem-sucedida' }); // Resposta apropriada
    });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;

    db.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            return res.status(500).json({ error: 'Erro ao excluir coordenador.' });
        }

        const getCpfQuery = 'SELECT cpf FROM coordenadores WHERE id = ?';
        
        db.query(getCpfQuery, [id], (err, results) => {
            if (err) {
                db.rollback(() => {
                    console.error('Erro ao obter CPF:', err);
                    return res.status(500).json({ error: 'Erro ao excluir coordenador.' });
                });
            } else if (results.length === 0) {
                db.rollback(() => {
                    console.error('Nenhum coordenador encontrado com o ID:', id);
                    return res.status(404).json({ error: 'Coordenador não encontrado.' });
                });
            } else {
                const cpf = results[0].cpf;
                
                const deleteCoordinatorQuery = 'DELETE FROM coordenadores WHERE `id` = ?';
                
                db.query(deleteCoordinatorQuery, [id], (err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error('Erro ao excluir coordenador:', err);
                            return res.status(500).json({ error: 'Erro ao excluir coordenador.' });
                        });
                    } else {
                        const deleteLoginQuery = 'DELETE FROM login WHERE `username` = ?';
                        
                        db.query(deleteLoginQuery, [cpf], (err) => {
                            if (err) {
                                db.rollback(() => {
                                    console.error('Erro ao excluir login:', err);
                                    return res.status(500).json({ error: 'Erro ao excluir login.' });
                                });
                            } else {
                                db.commit((err) => {
                                    if (err) {
                                        db.rollback(() => {
                                            console.error('Erro ao confirmar transação:', err);
                                            return res.status(500).json({ error: 'Erro ao excluir coordenador.' });
                                        });
                                    } else {
                                        res.status(200).json({ message: 'Coordenador excluído com sucesso.' });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

exports.detalhesCoordenador = (req, res) => {
    const id = req.params.id;

    const query = 'SELECT * FROM coordenadores WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar coordenador' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Coordenador não encontrado' });
        }

        const coordenador = result[0];
        
        // Renderiza uma página com os detalhes do coordenador ou retorna os dados como JSON
        res.render('detalheCoordenador', { coordenador }); // Certifique-se de que 'detalhesCoordenador' é a view correta
    });
};

exports.getCompany = (req, res) => {
    db.query('SELECT * FROM empresas', (error, results) => {
        if (error) {
            res.status(500).send('Erro interno ao buscar as empresas.');
        } else {
            res.render('paginaEmpresa', { empresas: results });
        }
    });
};

exports.registerCompany = (req, res) => {
    res.render('cadastrarEmpresa')
};

exports.addCompany = (req, res) => {
    const q = 'INSERT INTO empresas (`cnpj`, `empresa`, `email`, `telefone`, `cep`, `cidadeEstado`, `rua`, `numeroLocal`, `responsavelEmpresa`) VALUES(?)';
    const values = [
      req.body.cnpj,
      req.body.empresa,
      req.body.email,
      req.body.telefone,
      req.body.cep,
      req.body.cidadeEstado,
      req.body.rua,
      req.body.numeroLocal,
      req.body.responsavelEmpres,
    ];
  
    db.query(q, [values], (err) => {
      if (err) {
        console.error('Erro ao adicionar empresa:', err); // Log do erro
        req.flash('error', 'Erro ao adicionar empresa.'); // Define a mensagem flash de erro
        return res.redirect('/empresa/cadastrar'); // Redireciona para a página de cadastro
      } else {
        req.flash('success', 'Empresa adicionada com sucesso!'); // Define mensagem flash de sucesso
        return res.redirect('/empresa'); // Redireciona para a página de empresas
      }
    });
  };
   

  exports.getAluno = (req, res) => {
    db.query('SELECT * FROM alunos', (error, results) => {
        if (error) {
            res.status(500).send('Erro interno ao buscar os alunos.');
        } else {
            res.render('paginaCoordenador', { alunos: results });
        }
    });
};

exports.registerAluno = (req, res) => {
    res.render('cadastrarAluno')
};