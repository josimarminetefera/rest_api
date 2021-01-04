const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//VOU EXPORTAR SOMENTE O POOL 
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

                //MONTANDO UMA LISTA DE RESPOSTA PARA MELHORAR VISIBILIDADE DO RETORNO
                const resposta = {
                    quantidade: resultado.length,
                    produtos: resultado.map(i => {
                        //CADA ITEM DA MINHA LISTA EU VOU ALTERAR O VALOR QUE VOU RETORNAR
                        return {
                            id: i.id,
                            nome: i.nome,
                            preco: i.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos.',
                                url: 'http://localhost:3000/produto/' + i.id
                            }
                        }
                    })
                }

                return res.status(200).send({ resposta });
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
                //QUANDO ENTRAR NOCALBACK JA FEZ O QUE TINHA QUE FAZER ACIMA AI TEM QUE LIBERAR ESTA CONEXÃO
                //POIS O POOL DE CONEXÃO TEM UM LIMITE DE CONEXOES ABERTAS
                conexao.release();

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                const resposta = {
                    mensagem: "Produto inserido com sucesso",
                    produto: {
                        id: resultado.id,
                        nome: nome,
                        preco: preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um Produto.',
                            url: 'http://localhost:3000/produto/' + resultado.id
                        }
                    }
                }

                return res.status(201).send({ resposta });
            }
        );
    });
});

//ROTA DE GET PARA VISUALIZAR
rota.get("/:id_produto", (req, res, next) => {
    console.log("ROTA DE GET PARA VISUALIZAR");
    const id = req.params.id_produto
    mysql.getConnection((erro, conexao) => {
        //VERIICAR SE TEM ERRO NA CONEXAO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        //BUSCAR OS DADOS
        conexao.query(
            "SELECT * FROM produtos WHERE id = ?;",
            [id],
            //CALLBACK
            (erro, resultado, fields) => {
                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                if (resultado.length == 0) {
                    return res.status(404).send({ mensagem: "Não foi encontrado produto com este id" });
                }

                const retorno = {
                    mensagem: "Produto selecionado.",
                    produto: {
                        id: resultado.id,
                        nome: resultado.nome,
                        preco: resultado.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto.',
                            url: 'http://localhost:3000/produto/' + resultado.id
                        }
                    }
                }
                return res.status(200).send({ retorno });
            }
        );
    });
});

//ROTA DE PATCH PARA ALTERAR PRODUTO
rota.patch("/", (req, res, next) => {
    console.log("ROTA DE PATCH ALTERAR PRODUTO");
    //UM OUTRA FORMA DE FAZER SEM VARIAVEL 
    const { nome, preco, id } = req.body

    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        conexao.query(
            `
                UPDATE produtos
                    SET nome = ?, preco = ?
                WHERE id = ?;
            `,
            [nome, preco, id],
            //CALBACK DO query
            (erro, resultado, field) => {
                //QUANDO ENTRAR NOCALBACK JA FEZ O QUE TINHA QUE FAZER ACIMA AI TEM QUE LIVBERAR ESTA CONEXÃO
                //POIS O POOL DE CONEXÃO TEM UM LIMITE DE CONEXOES ABERTAS
                conexao.release();

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                const retorno = {
                    mensagem: "Produto alterado com sucesso.",
                    produto: {
                        id: id,
                        nome: nome,
                        preco: preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um produto.',
                            url: 'http://localhost:3000/produto/' + id
                        }
                    }
                }

                return res.status(202).send({ retorno });
            }
        );
    });
});

//PARA REMOÇÃO DE DADOS 
rota.delete("/", (req, res, next) => {
    console.log("ROTA DE DELETE PARA REMOVER");
    const { id } = req.body

    mysql.getConnection((erro, conexao) => {
        //VERIFICAR SE DEU ERRO NA CONEXÃO 
        if (erro) {
            return res.status(500).send({ erro: erro, response: null });
        }

        conexao.query(
            `
                DELETE FROM produtos WHERE id = ?;
            `,
            [id],
            //CALBACK DO query
            (erro, resultado, field) => {
                //QUANDO ENTRAR NOCALBACK JA FEZ O QUE TINHA QUE FAZER ACIMA AI TEM QUE LIVBERAR ESTA CONEXÃO
                //POIS O POOL DE CONEXÃO TEM UM LIMITE DE CONEXOES ABERTAS
                conexao.release();

                if (erro) {
                    return res.status(500).send({ erro: erro, response: null });
                }

                return res.status(202).send({
                    mensagem: "Produto removido com sucesso.",
                    response: resultado,
                });
            }
        );
    });
});

//EXPORTAR A ROTA PRONTA
module.exports = rota;