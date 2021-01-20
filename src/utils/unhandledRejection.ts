const chalk = require("chalk");

export default new class ev_unhandledRejection{
    name = 'unhandledRejection';
    run(reason: {} | null | undefined, promise: Promise<any>){
        console.log(chalk.red(`\nOcurrio un rechazo inesperado, \nRazon: ${reason}\n`), promise);
        process.stdout.write('->');
    }
}
