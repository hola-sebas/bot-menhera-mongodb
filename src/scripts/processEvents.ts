import unhandledRejection from "../utils/unhandledRejection";

export default new class utils_init {
    run = () => {
        console.log("Buscando Utilidades...");
        process.on(unhandledRejection.name, unhandledRejection.run);
    };
};
