CREATE DATABASE sistemaEstagio;
USE sistemaEstagio;

CREATE TABLE login (
    id int primary key auto_increment,
    username varchar(100) not null,
    password varchar(50) not null
);

CREATE TABLE coordenadores (
    id int primary key auto_increment,
    cpf varchar(14) not null,
    nome varchar(50) not null,
    sobrenome varchar(50) not null,
    numMatricula varchar(50) not null,
    email varchar(50) not null,
    telefone varchar(50) not null,
    cursoResponsavel varchar(50) not null
);

CREATE TABLE empresas (
    id int primary key auto_increment,
    cnpj varchar(18) not null,
    empresa varchar(255) not null,
    telefone varchar(80) not null,
    email varchar(100) not null,
    cep varchar(100) not null,
    cidadeEstado varchar(100) not null,
    rua varchar(200) not null,
    numeroLocal varchar(35) not null,
    responsavelEmpresa varchar(255) not null
);

CREATE TABLE alunos (
    id int primary key auto_increment,
    nome_completo varchar(255) not null,
    ra varchar(13) not null,
    cpf varchar(14) not null,
    email_institucional varchar(100) not null,
    telefone_pessoal varchar(50) not null,
    id_empresa int,

    CONSTRAINT FOREIGN KEY(id_empresa) REFERENCES empresas(id)
);

CREATE TABLE documentos_estagio (
    id_empresa int,
    data_inicio DATE,
    id_coordenador int,

    CONSTRAINT FOREIGN KEY(id_empresa) REFERENCES empresas(id),
    CONSTRAINT FOREIGN KEY(id_coordenador) REFERENCES coordenadores(id)
);

CREATE TABLE documentos_iniciais (
    plano_de_atividades_de_estagio DATE,
    apolice_de_seguro DATE
);

CREATE TABLE documentos_de_equivalencia (
    data_entrega DATE
);

CREATE TABLE documentos_finais (
    relatorio_final_simplificado DATE,
    relatorio_para_supervisão_de_estagio DATE,
    modelo_de_relatorio_final_completo DATE,
    ficha_de_avaliacao_de_desenvolvimento_de_estagio DATE
);
