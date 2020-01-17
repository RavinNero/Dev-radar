const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

//Quando se acessa uma aplicação web existem dois parametros, a request(requisição) que se encarrega de pegar tudo que vem do frontend, ou seja, toda informação necessária para retornar aquilo que usuário pediu. O outro parametro é o response(resposta) que é o resultado daquilo que foi pedido pelo cliente/usuario, em outras palavras é aquilo que  se retorna como esposta a aquio que foi requisitado

//Metodos Http: GET, POST, PUT, DELETE

//Tipos de parâmetros dentro do express:
//Query params: request.query (Filtros, Ordenação, Paginação, ...)
//Route params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)


//O controller deve ter 5 funções index(Listar), show(Mostrar apenas uma entidade), store(Salvar uma nova entidade), update(Atualizar uma nova entidade), destroy(Deletar uma nova entidade)

module.exports = {
    
    async index(request, response)
    {
        const devs = await Dev.find()

        return response.json(devs)
    },

    async store(request, response)
    {
    //async diz para a requisição que ela pode demorar, e se o parametro await for utilizado quer dizer que a aplicação vai esperar uma resposta ser recebida para continuar a requisição
        const { github_username, techs, latitude, longitude } = request.body //Pega os dados enviados pelo usuario(que vão no corpo do post)
        
        let dev = await Dev.findOne({ github_username })

        if(!dev)
        {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`) //conecta na Api do Github utilizando axios e armazena em uma variável

            const { name = login, avatar_url, bio } = apiResponse.data //pega dados especificos da variavel que armazena os dados da Api

            const techsArray = parseStringAsArray(techs) //Pega os dados provenientes do usuario e separa em arrays

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs:techsArray,
                location,
            }) //Salva os dados que o usuário cadastrou e salva em um banco de dados, tambem armazena a resposta do banco de dados em uma variavel para ser retornada depois
        }

        return response.json(dev)
    },

    async update(request, response)
    {
        //Só altera localização, bio, name, techs, avatar_url
        const { search, bio, name, techs, latitude, longitude, avatar } = await request.query

        const techsParsed = parseStringAsArray(techs)

        const locationActualized = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
        
        const devToUpdate = await Dev.updateOne({ github_username: search },{
            bio: bio,
            name: name,
            techs: techsParsed,
            location: locationActualized,
            avatar_url: avatar
        })

        return response.json({ devToUpdate })
    },    

    async destroy(request, response)
    {
        const { search } = await request.query
        
        const devToDelete = await Dev.deleteOne({ github_username: search })

        return response.json({ devToDelete })
    }
}