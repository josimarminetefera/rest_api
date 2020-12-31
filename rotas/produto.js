const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

const mysql = require("../mysql").pool;

//ROTA DE GET PARA LISTAR
rota.get("/", (req, res, next) => {
    console.log("ROTA DE GET PARA LISTAR");
    mysql.getConnection((erro, conexao) => {
        //VERIICAR SE TEM ERRO NA CONEXAO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        //BUSCAR OS DADOS
        conexao.query(
            "SELECT * FROM produtos;",
            //CALLBACK
            (erro, resultado, fields) => {
                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }
                return res.status(200).send({ response: resultado });
            }
        );
    });
});

//ROTA DE POST CADASTRAR
rota.post("/", (req, res, next) => {
    console.log("ROTA DE POST CADASTRAR");
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
    }
    //UM OUTRA FORMA DE FAZER SEM VARIAVEL 
    const { nome, preco } = req.body

    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        conexao.query(
            "INSERT INTO produtos (nome, preco) VALUES (?,?)",
            [nome, preco],
            //CALBACK DO query
            (erro, resultado, field) => {
                //QUANDO ENTRAR NOCALBACK JA FEZ O QUE TINHA QUE FAZER ACIMA AI TEM QUE LIVBERAR ESTA CONEXÃO
                //POIS O POOL DE CONEXÃO TEM UM LIMITE DE CONEXOES ABERTAS
                conexao.release();

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                return res.status(201).send({
                    mensagem: "Produto inserido com sucesso.",
                    response: resultado,
                    id_produto: resultado.insertId
                });
            }
        );
    });
});

//ROTA DE GET PARA VISUALIZAR
rota.get("/:id_produto", (req, res, next) => {
    const id = req.params.id_produto
    if (id == 123) {
        res.status(200).send({
            mensagem: "Usando GET de um produto específico 123.",
            id: id,
        });
    } else {
        res.status(200).send({
            mensagem: "Usando GET de um produto específico outro id.",
            id: id,
        });
    }
});

//ROTA DE PATCH
rota.patch("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pagina PATCH de produto."
    })
});

//PARA REMOÇÃO DE DADOS 
rota.delete("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pagina DELETE de produto."
    })
});

//EXPORTAR A ROTA PRONTA
module.exports = rota;