console.log("produtos.js - INICIANDO ROTA DE PRODUTO");
const express = require("express");

//ABRINDO A ROTA
const rota = express.Router();

//VOU EXPORTAR SOMENTE O POOL 
const mysql = require("../mysql").pool;

//biblioteca para trabalhar com arquivos no json
const multer = require("multer");

//importar o middleware
const login_middleware = require("../middleware/login_middleware");

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

const produtos_controller = require("../controllers/produto_controller");

//ROTA DE GET PARA LISTAR
rota.get("/", produtos_controller.listar);
//ROTA DE POST PARA CADASTRAR
//nesta rota podem ser passados vários renders ou metodos por exemplo upload.single('produto_imagem')
//antes de (req, res, next)  voce pode colocar vários metodos para a rota executar antes.
//login_middleware está depois de pegar o arquivo pois envio dos dados está como form_data
rota.post("/", login_middleware.obrigatorio, upload.single('produto_imagem'), produtos_controller.cadastrar);
rota.get("/:id_produto", produtos_controller.visualizar);
rota.patch("/", login_middleware.obrigatorio, produtos_controller.alterar);
rota.delete("/", login_middleware.obrigatorio, produtos_controller.remover);

//EXPORTAR A ROTA PRONTA
module.exports = rota;