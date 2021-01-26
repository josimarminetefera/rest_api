console.log("usuario.js - INICIANDO ROTA DE USUARIO");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

const usuario_controller = require("../controllers/usuario_controller");

rota.post("/cadastrar", usuario_controller.cadastrar);

rota.post("/login", usuario_controller.login);

module.exports = rota;