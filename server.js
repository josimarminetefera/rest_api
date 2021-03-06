//para iniciar o projeto npm start
console.log("server.js - INICIANDO SERVICOS");
//CRIAR SERVIÇO HTTP
const http = require("http");

//IMPORTAR O APP
const app = require("./app");

//POSTA DA APLICAÇÃO 
const porta = process.env.PORTA || 3000;

//CRIAR O SERVIDOR
const servidor = http.createServer(app);

//ESCUTANDO A PORTA
servidor.listen(porta);
console.log("server.js - SERVICO INICIADO");
console.log("----------------------------------");