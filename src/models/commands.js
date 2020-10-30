const mongoose = require('mongoose')
const { Schema } = mongoose

const guildSchema = new Schema({
    commands: {
        type: Array,
        required: true
    },
    categories:{
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('commands', guildSchema)