var config = {
    // production mode
    production: {
        "token": "NzMyMzk4MDI2ODc4MDkxMjg0.Xw0A0A.G0UonZCOXkHbgJS1N0GrbmSzkA4",
        "clientID": "732398026878091284",
        "mongodbPassword": "mlvqFRBXNdXyM3Xb",
        "mongodbUser": "danny",
        "database": "production",
        "prefix": "ki!",
        "tnaiToken": "EHxye1JxbnxVxIaexI8TqFG685"
    },
    // dev mode
    development: {
        "token": "NzQwNzU4MDIzNDc5NDkyNjE5.Xytqqw.wq6B2XwmULf25wuze7xD4i24UYU",
        "clientID": "740758023479492619",
        "mongodbPassword": "4xaEz0ZhgHdG9neS",
        "mongodbUser": "UserTest",
        "database": "test",
        "prefix": "ki!",
        "tnaiToken": "EHxye1JxbnxVxIaexI8TqFG685"
    }
};

var configToExport: typeof config.production;

if (process.env.NODE_ENV == "production") {
    configToExport = config.production;
} else {
    configToExport = config.development;
};

export default configToExport;
