import mongoose from 'mongoose';
import config from './config';

export default async (callback: () => void) => {
    console.log('Connecting to DB');
    var user = config.mongodbUser;
    var password = config.mongodbPassword;
    var database = config.database;

    try {
        await mongoose.connect(`mongodb+srv://${user}:${password}@cluster.worgv.gcp.mongodb.net/${database}?retryWrites=true&w=majority`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("The database is connected");
        callback();
    } catch (err) {
        console.error(`ERROR exit code 2: someting worng while connecting to DB: ` + err);
        process.exit(2);
    }
};
