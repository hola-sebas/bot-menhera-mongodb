console.log('\nConectando a la base de datos');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://danny:MVAK2mc0r2M95d8u@cluster.worgv.gcp.mongodb.net/?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(console.log(`La base de datos esta conectada\n`))
    .catch(err => console.log(err))