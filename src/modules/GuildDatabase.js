// DONE
const configJSON = require('../config.json')
const guild = require('../models/guild')

module.exports = {
    run: async (message, client) => {
        //iniciar servidor en la base de datos 
        let config = await guild.findOne({ guildId: message.guild.id })
        if (config) return config
        const newGuild = new guild({
            guildId: message.guild.id,
            configuracion: {
                prefix: configJSON.prefix,
                comandosDesactivados: [],
                categoriasDesactivadas: []
            },
            mensajes: {
                autoReply: true,
                welcome: {
                    img: 'https://menherachan.herokuapp.com/images/backgroundimage.jpg',
                    message: 'Bienvenido al server',
                    channel: '0'
                },
                goodbye: {
                    message: 'Se fue de el server',
                    channel: '0'
                }
            }
        })
        return await newGuild.save()
    }
}