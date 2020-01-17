const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express();

mongoose.connect('mongodb+srv://ravin:ravinravin@cluster0-kc4db.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//A função app.use() indica que a regra de seu parâmetro será válida para todas as rotas da aplicação. Poderia também ser indicada rotas especificas. EX: app.get(); app.post(); etc...

app.use(express.json())
app.use(routes)

app.listen(3333)