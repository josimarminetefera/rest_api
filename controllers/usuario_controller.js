console.log("usuario_controller.js - INICIANDO CONTROLLER DE USUARIO");
const express = require("express");

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

//biblioteca de criptografar a senha
const bcrypt = require("bcrypt");

//gerar e monitorar token
const jsonwebtoken = require("jsonwebtoken");

exports.cadastrar = (req, res, next) => {
    console.log("usuario_controller.js - INICIANDO FUNÇÃO cadastrar");
    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        //verificar se ja tem email cadastrado
        conexao.query(
            "SELECT * FROM usuario WHERE email = ?",
            [req.body.email],
            (erro, resultado) => {
                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                if (resultado.length > 0) {
                    return res.status(401).send({ erro: "Usuario já cadastrado", response: null });
                } else {
                    //o 10 é o tamanho da complexidade da senha 
                    bcrypt.hash(req.body.senha, 10, (erro, hash) => {
                        console.log("usuario.js - INICIANDO FUNÇÃO bcrypt " + erro);
                        if (erro) {
                            return res.status(500).send({ erro: erro, response: null });
                        }
                        //abrir a conecção sql para inserir os dados no banco 
                        conexao.query(
                            "INSERT INTO usuario (email, senha) values(?, ?)",
                            [req.body.email, hash],
                            (erro, resultado) => {
                                console.log("usuario.js - INICIANDO FUNÇÃO conexao.query");
                                //fechar conexão para naão manter ela aberta para as outras coisas
                                conexao.release();
                                if (erro) {
                                    return res.status(500).send({ erro: erro, response: null });
                                }

                                const resposta = {
                                    mensagem: "Usuario criado com sucesso",
                                    usuario: {
                                        id: resultado.insertId,
                                        email: req.body.email
                                    }
                                }
                                return res.status(201).send({ resposta })
                            }
                        );
                    });
                }
            }
        );
    });
};

exports.login = (req, res, next) => {
    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }
        conexao.query(
            `SELECT * FROM usuario where email = ?`,
            [req.body.email],
            (erro, resultado, filds) => {
                conexao.release();

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                if (resultado.length < 1) {
                    return res.status(401).send({ mensagem: "02: Falha na autenticação." });
                }

                bcrypt.compare(
                    req.body.senha,
                    resultado[0].senha,
                    (erro, resultado_bcrypt) => {
                        if (erro) {
                            return res.status(401).send({ mensagem: "01: Falha na autenticação." });
                        }

                        if (resultado_bcrypt) {
                            //tudo certo
                            let token = jsonwebtoken.sign(
                                {
                                    id: resultado[0].id,
                                    email: resultado[0].email
                                },
                                process.env.JWT_TOKEN_KEY,
                                {
                                    expiresIn: "1h"
                                }
                            );

                            return res.status(200).send({
                                mensagem: 'Autenticado com sucesso',
                                token: token
                            });
                        }

                        //usuário ou senha incorreto
                        return res.status(401).send({ mensagem: "Usuário ou senha incorretos." });
                    }
                );
            }
        );
    });
};