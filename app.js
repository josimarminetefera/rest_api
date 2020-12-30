const express = require("express");

//INSTANCIA DO EXPRESS
const app = express();

//PARA FAZER O REGISTRO DE LOGS DE ACESSO
const morgan = require("morgan");

//ELE DEFINE O CORPO DAS REQUISIÇÕES DE ENTRADA
const body_parser = require("body-parser")

//CONSTRUINDO ROTA DE PRODUTOS
const rota_produtos = require("./routes/produto");

//PARA MONITORAR TODA EXECUÇÃO E DAR UM LOG
app.use(morgan("dev"));

//FALANDO QUE A ENTRADA DE DADOS VAI ACEITAR APENAS DADOS SIMPLES
app.use(body_parser.urlencoded({ extended: false }));
//ACEITA APENAS FORMATO JSON DE ENTRADA NO BODY
app.use(body_parser.json());

app.use("/produto", rota_produtos);

//SE NENHUMA DAS ROTAS ACIMA FUNCIONAR AI ELE CAI AQUI NESTES DE ERRO
//SE ENEHUMA DAS RODAS ACIMA FOR ENCONTRADA ELE COLOCA ESTA TELA AQUI 
app.use((req, res, next) => {
    const erro = new Error("link não encontrado")
    erro.status = 404;
    next(erro);
});

app.use((erro_antes, req, res, next) => {
    res.status(erro_antes.status || 500);
    return res.send({
        erro: {
            mensagem: erro_antes.message
        }
    });
});

module.exports = app;