const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(request, response)
    {
        //Buscar todos os Devs em um raio de 10km
        //Filtrar por tecnologias
        const { latitude, longitude, techs } = request.query


        const techsArray = parseStringAsArray(techs)
        
        //$in, $near, $geometry, $maxDistance são operadores lógicos no mongoDB qu nos permitem usar lógicas de filtro em nossa queries ao banco de dados 
        const devs = await Dev.find(
        {
            techs:
            {
                $in: techsArray,
            },
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        })

        return response.json({ devs })
    }
}