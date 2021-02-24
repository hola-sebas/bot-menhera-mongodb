import unhandledRejection from "../process-utils/unhandledRejection";

export default new class utils_init {
    run = () => {
        console.log("Searching utils...");
        process.on(unhandledRejection.name, unhandledRejection.run);
        console.log(`Utils loaded!`);
    };
};
