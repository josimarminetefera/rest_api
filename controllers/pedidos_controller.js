console.log("pedidos_controller.js - INICIANDO CONTROLLER DE PEDIDOS");
const express = require("express");

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

exports.listar = (req, res, next) => {
    console.log("pedidos_controller.js - listar");
    mysql.getConnection((erro, conexao) => {

        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        //buscar os dados 
        conexao.query(
            `
                SELECT 
                    pedidos.id as id_pedido,
                    pedidos.quantidade,
                    produtos.id as id_produto,
                    produtos.nome,
                    produtos.preco
                FROM pedidos
                INNER JOIN produtos on produtos.id = pedidos.id_produto;
            `,
            //callback
            (erro, resultado, fields) => {

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }
                console.log(resultado);
                const resposta = {
                    quantidade: resultado.length,
                    pedido: resultado.map(i => {
                        return {
                            id: i.id_pedido,
                            quantidade: i.quantidade,
                            produto: {
                                id: i.id_produto,
                                nome: i.nome,
                                preco: i.preco,
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Pegar detalhes de um pedido.',
                                url: 'http://localhost:3000/pedido/' + i.id_pedido
                            }
                        }
                    }),
                }

                return res.status(200).send({ resposta });
            }
        );
    });
};

exports.cadastrar = (req, res, next) => {
    console.log("pedidos_controller.js - cadastrar");
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
                                pedido: {
                                    id: resultado.id,
                                    id_produto: id_produto,
                                    quantidade: quantidade,
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
};