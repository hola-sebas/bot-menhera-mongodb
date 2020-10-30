const mongoose = require('mongoose')
const { Schema } = mongoose

const bugsSchema  = new Schema({
    userId: Number,
    username: String,
    bug: Array
})

module.exports = mongoose.model('bugs', bugsSchema)