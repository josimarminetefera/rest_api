const express = require("express");

//INSTANCIA DO EXPRESS
const app = express();

const morgan = require("morgan");

//CONSTRUINDO ROTA DE PRODUTOS
const rota_produtos = require("./routes/produto");

//PARA MONITORAR TODA EXECUÇÃO E DAR UM LOG
app.use(morgan("dev"));
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