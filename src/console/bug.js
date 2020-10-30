const bugs = require('../models/bugs')
module.exports = {
    name: 'bugs',
    execute: async (client, chalk, args) => {
        let config = await bugs.find()
        if (!args.length) {
            console.log(config.map(userBug => {
                return `bug por ${userBug.username}(${userBug.userId})\n${userBug.bug.map(bug => {
                    return `- ${bug}`
                })}`
            }).toString())
            return
        }
        if (args[0] == 'ok') {
            if (!args[1]) return console.log('Debes poner una id');
            let a = config.filter(c => c.userId == args[1])
            if (!a.length) {
                console.log('No encontre el usuario');
                return
            }
            bugs.findOneAndDelete({ userId: args[1] }, (err, res) => {
                if (err) {
                    console.log(err)
                }
                if (res) {
                    console.log('ok')
                }
            })
        }
    }
}