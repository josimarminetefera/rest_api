const express = require("express");

//INSTANCIA DO EXPRESS
const app = express();

app.use((req, res, next) => {
    res.status(200).send({
        mensagem: "Ok, Deu tudo certo!"
    });
});

module.exports = app;