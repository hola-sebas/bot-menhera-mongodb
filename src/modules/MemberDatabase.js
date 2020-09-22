// DONE

const user = require('../models/user')

module.exports = {
    run: async (message, client) => {
        if (message.author.bot) return
        let config = await user.findOne({ userId: message.author.id })
        if (config) return config
        const newUser = new user({
            userId: message.author.id,
            money: {
                efectivo: 0,
                bank: 0
            },
            xp: {
                actual: 0,
                necesario: 100,
                nivel: 1,
            },
            inventory: {
                bag: [],
                shop: {
                    open: false,
                    ventas: {
                        usuario: 'No hay datos',
                        producto: 'No hay datos'
                    },
                    compras: {
                        usuario: 'No hay datos',
                        producto: 'No hay datos',
                        fecha: 'No hay datos'
                    },
                    productos: []
                }
            }
        })
        return await newUser.save()
    }
}