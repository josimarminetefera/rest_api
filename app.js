const express = require("express");

//INSTANCIA DO EXPRESS
const app = express();

//CONSTRUINDO ROTA DE PRODUTOS
const rota_produtos = require("./routes/produto");

app.use("/produto", rota_produtos);

//SEM ROTA DIRETO NA RAIZ
app.use((req, res, next) => {
    res.status(200).send({
        mensagem: "Ok, Deu tudo certo!"
    });
});

module.exports = app;