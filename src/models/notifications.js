const mongoose = require('mongoose')
const { Schema } = mongoose

const notificationsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date(Date.now())
    }
})

module.exports = mongoose.model('notifications', notificationsSchema)