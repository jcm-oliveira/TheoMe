const express = require("express")
const server = express()
const routes = require("./routes")
const path = require("path")

//usando template engine ejs
server.set('view engine', 'ejs')

//mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos statics
server.use(express.static("public"))
server.use(express.static("src"))

//usar o req.body
//server.use(express.urlencoded({extened:true}))
server.use(express.json());
    
//routes para
server.use(routes)

server.listen(3000, () => console.log('rodando em localhost:3000'))