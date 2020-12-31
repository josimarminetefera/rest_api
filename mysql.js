const mysql = require("mysql");

//PARA INICIAR A CONEXÃO 
var pool = mysql.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});
console.log("CONECTANDO BANCO DE DADOS");
exports.pool = pool;