const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")
const { createSessionMiddleware } = require("./auth/session")
const { sameOriginGuard, loadCurrentUser, requireCmsAccess } = require("./auth/access")

//usando template engine ejs
server.set('view engine', 'ejs')

//mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//atrás de proxy reverso (HTTPS), informar TRUST_PROXY=1 no .env
if (process.env.TRUST_PROXY) {
    server.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY)
}

//não informar a tecnologia do servidor nas respostas
server.disable('x-powered-by')

//habilitar arquivos statics (a pasta src não é publicada: contém o código do servidor)
server.use(express.static("public"))

//usar o req.body
server.use(express.urlencoded({ extended: true }))
server.use(express.json());

//sessão, proteção contra envios de outros sites e controle de acesso ao CMS
server.use(createSessionMiddleware())
server.use(sameOriginGuard)
server.use(loadCurrentUser)
server.use(requireCmsAccess)

//routes para
server.use(routes)

server.listen(3000, () => console.log('rodando em localhost:3000'))
