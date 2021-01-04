const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

//INSERIR UM PEDIDO
rota.post("/", (req, res, next) => {
    console.log("ROTA DE POST PARA INSERIR PRODUTO");
    const { id_produto, quantidade } = req.body;

    mysql.getConnection((erro, conexao) => {
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }
        conexao.query(
            "SELECT * FROM produtos WHERE id = ?",
            [id_produto],
            (erro, resultado, field) => {
                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }
                if (resultado.length == 0) {
                    return res.status(404).send({ mensagem: "Não foi encontrado produto com este id" });
                }

                mysql.getConnection((erro, conexao) => {
                    //VERIFICAR SE DEU ERRO NA CONEXÃO 
                    if (erro) {
                        return res.status(500).send({ erro: erro, response: null });
                    }

                    conexao.query(
                        "INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)",
                        [id_produto, quantidade],
                        //CALBACK DO query
                        (erro, resultado, field) => {
                            //QUANDO ENTRAR NOCALBACK JA FEZ O QUE TINHA QUE FAZER ACIMA AI TEM QUE LIBERAR ESTA CONEXÃO
                            //POIS O POOL DE CONEXÃO TEM UM LIMITE DE CONEXOES ABERTAS
                            conexao.release();

                            if (erro) {
                                return res.status(500).send({ erro: erro, response: null });
                            }

                            const resposta = {
                                mensagem: "Pedido inserido com sucesso",
                                produto: {
                                    id: resultado.id,
                                    request: {
                                        tipo: 'POST',
                                        descricao: 'Insere um pedido.',
                                        url: 'http://localhost:3000/tarefa/' + resultado.id
                                    }
                                }
                            }

                            return res.status(201).send({ resposta });
                        }
                    );
                });
            }
        );
    });
});

//EXPORTAR A ROTA PRONTA
module.exports = rota;