const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//ROTA DE GET
rota.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: "Página GET de  produto."
    });
});

rota.post("", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pagina POST de produto."
    })
});

//EXPORTAR A ROTA PRONTA
module.exports = rota;