console.log("app.js - INICIANDO APP");
const express = require("express");

//INSTANCIA DO EXPRESS
const app = express();

//PARA FAZER O REGISTRO DE LOGS DE ACESSO
const morgan = require("morgan");

//ELE DEFINE O CORPO DAS REQUISIÇÕES DE ENTRADA
const body_parser = require("body-parser")

console.log("app.js - CONSTRUINDO ROTAS");
const rota_usuario = require("./rotas/usuario");
const rota_produtos = require("./rotas/produto");
const rota_pedidos = require("./rotas/pedidos");

//PARA MONITORAR TODA EXECUÇÃO E REQUIZIÇÃO E DAR UM LOG
app.use(morgan("dev"));

//diretorio de uploads está aberto publicamente 
app.use("/uploads", express.static("uploads"));

//FALANDO QUE A ENTRADA DE DADOS VAI ACEITAR APENAS DADOS SIMPLES
app.use(body_parser.urlencoded({ extended: false }));
//ACEITA APENAS FORMATO JSON DE ENTRADA NO BODY
app.use(body_parser.json());

//INSERIR INFORMAÇÕES DE SEGURANÇA PARA USAR A APLICAÇÃO 
app.use((req, res, next) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("app.js - FUNÇÃO DE SEGURANÇA DO SERVER");
    //PROPRIEDADE DE ONDE É A ORIGEM - PARA ACEITAR UM SERVIDOR ESPECIFICO "HTTP://SERVERVIDOR.COM.BR"
    res.header("Acces-Control-Allow-Origin", "*");
    //QUAIS AS PROPRIEDADES DE CABEÇALHO SÃO ACEITAS 
    res.header(
        "Acces-Control-Allow-Header",
        "Content-Type, X-Requested-With, Origin, Accept, Authorization,"
    );

    //QUANDO O CLIENT VAI CHAMAR A API ELE PASSA ALGUNS OPTIONS
    //ESTE OPTIONS SERVEM PARA IDENTIFICAR QUAIS OS TIPOS DE OPÇÕES QUE SÃO ACEITAS PELO NOSSO SERVIDOR VINDO DE FORA
    if (req.method == "OPTIONS") {
        res.header("Acces-Control-Allow-Methods", "PUT, POST, PATH, DELETE, GET");
        return res.status(200).send({});
    }

    //PULAR PARA A PROXIMA FUNÇÃO 
    console.log("app.js - FIM FUNÇÃO DE SEGURANÇA DO SERVER");
    next();
});

console.log("app.js - DETALHANDO LINK DA ROTAS");
app.use("/usuario", rota_usuario);
app.use("/produto", rota_produtos);
app.use("/pedidos", rota_pedidos);

//SE NENHUMA DAS ROTAS ACIMA FUNCIONAR AI ELE CAI AQUI NESTES DE ERRO
//SE ENEHUMA DAS RODAS ACIMA FOR ENCONTRADA ELE COLOCA ESTA TELA AQUI 
app.use((req, res, next) => {
    console.log("app.js - FUNÇÃO QUANDO A ROTA ESTÁ ERRADA");
    const erro = new Error("Link não encontrado")
    erro.status = 404;
    next(erro);
});

//TRATAMENTO QUE VAI RETORNAR QUALQUER ERRO QUE SEMPRE VAI RETORNAR CASO AS ROTAS ACIMA NÃO RETORNE NADA
app.use((erro, req, res, next) => {
    console.log("app.js - FUNÇÃO PARA RETORNAR O ERRO");
    res.status(erro.status || 500);
    return res.send({
        erro: {
            mensagem: erro.message
        }
    });
});

module.exports = app;