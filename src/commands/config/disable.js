const guild = require('../../models/guild')
module.exports = {
    name: 'disable',
    description: 'Desabilita un comado o categoria',
    usage: 'disable < -c(categoria) / -co(comando)> <nombre>',
    aliases: ['dis'],
    permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
    category: __dirname.split(require('path').sep).pop(),
    disable: false,
    cooldown: 5,

    execute: async (message, args, prefix, client) => {
        if (!message.member.permissions.has('ADMINISTRATOR'))return message.channel.send('No tienes los permisos para ejecutar este comando').then(m => m.delete({ timeout: 5000 }))

        let config = await guild.findOne({guildId: message.guild.id})
        switch (args[0]) {
            case '-co':
                if (!args[1]) return message.channel.send('Debes poner un comando')
                let comando = args[1]
                const command = client.commands.get(comando)
                    || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(comando));
                let disables = config.configuracion.comandosDesactivados

                if (disables.includes(command.name)) {
                    message.channel.send('El comando ya esta desactivado')
                    return
                }
                if (command.disable == false) {
                    message.channel.send('No se puede desactivar el comando por que es esencial')
                    return
                }
                if (command) {
                    config.configuracion.comandosDesactivados.push(command.name)
                    config.save()
                    message.channel.send('Comando desactivado')
                    return
                }
                message.channel.send('No encontre el comando')
                break;

            case '-c':
                if (!args[1]) return message.channel.send('Debes poner una categoria')
                let categorias = client.categoria
                let argumentos = args[1]
                let ya = config.configuracion.categoriasDesactivadas
                if (!categorias.includes(argumentos)) {
                    message.channel.send('Esa categoria no existe')
                    return
                }

                try {
                    const x = require(`../../commands/${argumentos}/index.json`)
                    if (x.disable == undefined) {
                        process.emit('error', 81, `../../commands/${argumentos}/index.json`)
                        return
                    }
                    if (x.disable == false) {
                        message.channel.send('Lo siento pero no puedes desactivar esa categoria')
                        return
                    }
                } catch (err) {
                    process.emit('error', 8, `../../commands/${argumentos}/index.json`, err)
                }

                if (ya.includes(argumentos)) {
                    message.channel.send('Lo siento pero esta categoria ya esta desactivada')
                    return
                }

                if (categorias.includes(argumentos)) {
                    config.configuracion.categoriasDesactivadas.push(argumentos)
                    config.save()
                    message.channel.send('Ok desabilite esa categoria')
                    return
                }
                break;

            default:
                message.channel.send('Debes especificar que tengo que desactivar asi < -c(categoria) / -co(comando) >')
                break;
        }
    }
}
