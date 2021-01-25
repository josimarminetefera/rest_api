console.log("pedido.js - INICIANDO ROTA DE PEDIDO");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

console.log("pedido.js - INICIAR O CONTROLLER pedido_controller");
const pedido_controller = require("../controllers/pedido_controller");

rota.get("/", pedido_controller.listar);
rota.post("/", pedido_controller.cadastrar);

//EXPORTAR A ROTA PRONTA
module.exports = rota;