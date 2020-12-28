const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//ROTA DE GET
rota.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: "Página GET de  produto."
    });
});

rota.post("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pagina POST de produto."
    })
});

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

//EXPORTAR A ROTA PRONTA
module.exports = rota;