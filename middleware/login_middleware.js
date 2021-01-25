console.log("login_middleware.js - INICIANDO MIDDLEWARE");
//gerar e monitorar token
const jsonwebtoken = require("jsonwebtoken");

//metodo para verificar antes de entrar na rota se o usuário está logado
module.exports = (req, res, next) => {
    try {
        console.log(">>>>-------------------------->");
        console.log("login_middleware.js - AUTENTICANDO A ROTA");
        //por padrão o certo é pegar do header
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        //verifica se o token está certo passando a chave para decodificar
        const decode = jsonwebtoken.verify(token, process.env.JWT_TOKEN_KEY)
        //json já com id do usuário é email
        req.usuario = decode;
        //pode seguir para o próximo método
        next();
    } catch (erro) {
        return res.status(401).send({ mensagem: "Falha na autenticação do middleware!" });
    }
}