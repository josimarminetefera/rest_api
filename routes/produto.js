const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//ROTA DE GET PARA LISTAR
rota.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: "Página GET de  produto."
    });
});

//ROTA DE POST CADASTRAR
rota.post("/", (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
    }
    res.status(201).send({
        mensagem: "Pagina POST de produto.",
        produto: produto
    })
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