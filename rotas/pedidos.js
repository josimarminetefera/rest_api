console.log("pedidos.js - INICIANDO ROTA DE PEDIDOS");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

console.log("pedidos.js - INICIAR O CONTROLLER pedidos_controller");
const pedidos_controller = require("../controllers/pedidos_controller");

rota.get("/", pedidos_controller.listar);
rota.post("/", pedidos_controller.cadastrar);

//EXPORTAR A ROTA PRONTA
module.exports = rota;