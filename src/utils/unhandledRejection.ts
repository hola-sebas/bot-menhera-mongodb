import chalk from "chalk";

export default new class ev_unhandledRejection {
    name = 'unhandledRejection';
    run(reason: {} | null | undefined, promise: Promise<any>) {
        console.log(chalk.red(`\nUnhandled Rejection ocurred,\nreason: ${reason}\n`), promise);
    }
};
