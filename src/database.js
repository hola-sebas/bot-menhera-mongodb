console.log('Conectando a la base de datos');
const mongoose = require('mongoose')
const config = require('./config.json')
mongoose.connect(`mongodb+srv://${config.mongodbUser}:${config.dbPassword}@cluster.worgv.gcp.mongodb.net/?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(console.log(`La base de datos esta conectada\n`))
    .catch(err => console.log(err))