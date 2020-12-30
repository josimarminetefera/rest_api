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

//INSERIR INFORMAÇÕES DE SEGURANÇA PARA USAR A APLICAÇÃO 
app.use((req, res, next) => {
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
    next();
});

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