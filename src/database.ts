import mongoose from 'mongoose';
import config from './config';

export default async (callback: () => void) => {
    console.log('Conectando a la base de datos');
    var user; 
    var password;
    var database;
    if (process.env.NODE_ENV == "production") {
        user = config.mongodbUser;
        password = config.mongodbPassword;
        database = config.database;
    } else {
        user = config.devMongodbUser;
        password = config.devMongodbPassword;
        database = config.devDatabase;
    }
    try {
        await mongoose.connect(`mongodb+srv://${user}:${password}@cluster.worgv.gcp.mongodb.net/${database}?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("La base de datos esta conectada!");
        callback();
    } catch (err) {
        console.error(`ERROR exit code 2: hubo un error intentando conectar a la base de datos: ` + err);
        process.exit(2);
    }
}
