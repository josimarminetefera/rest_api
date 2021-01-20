console.log("produtos.js - INICIANDO ROTA DE PRODUTO");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

//biblioteca para trabalhar com arquivos no json
const multer = require("multer");

//dar dados a o arquivo antes de gravar ele no banco de dados
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //callback(erro,diretório para salvar o arquivo)
        callback(null, "./uploads/");
    },
    filename: function (req, file, callback) {
        //gerar o nome do arquivo com diferencial antes
        //callback(null, new Date().toISOString() + file.originalname);
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        callback(null, data + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        //true quer dizer que voce quer que passe
        callback(null, true);
    } else {
        //false quer dizer que voce quer que não passe
        callback(null, false);
    }
}

//indicando a pasta que todos uploads vão para esta pasta uplods
const upload = multer({
    storage: storage,
    //regra de tamanho maximo de arquivo
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
    //dest: "uploads/", deixa de receber esta propriedade pois vai receber o storage
});

//ROTA DE GET PARA LISTAR
rota.get("/", (req, res, next) => {
    console.log("produtos.js - ROTA DE GET PARA LISTAR");
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
                            imagem_produto: i.imagem_produto,
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

//ROTA DE POST PARA CADASTRAR
//nesta rota podem ser passados vários renders ou metodos por exemplo upload.single('produto_imagem')
rota.post("/", upload.single('produto_imagem'), (req, res, next) => {
    console.log("produtos.js - ROTA DE POST CADASTRAR");

    //propriedade que o proprio multer tras
    console.log(req.file);

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
            "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)",
            [
                nome, 
                preco,
                req.file.path
            ],
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
                        imagem_produto: req.file.path,
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
    console.log("produtos.js - ROTA DE GET PARA VISUALIZAR");
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
    console.log("produtos.js - ROTA DE PATCH ALTERAR PRODUTO");
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
    console.log("produtos.js - ROTA DE DELETE PARA REMOVER");
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