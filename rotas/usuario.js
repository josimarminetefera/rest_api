console.log("usuario.js - INICIANDO ROTA DE USUARIO");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

//biblioteca de criptografar a senha
const bcrypt = require("bcrypt");

rota.post("/cadastrar", (req, res, next) => {
    console.log("usuario.js - INICIANDO FUNÇÃO cadastrar");
    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }
        //o 10 é o tamanho da complexidade da senha 
        bcrypt.hash(req.body.senha, 10, (erro, hash) => {
            console.log("usuario.js - INICIANDO FUNÇÃO bcrypt "+erro);
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
    });
});

module.exports = rota;