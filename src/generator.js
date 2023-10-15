const nodePlop = require('node-plop');
const chalk = require('chalk');

module.exports = {
    chooseGenerator(plopList) {
        const pgen = nodePlop();
        const generator = pgen.setGenerator('choose-generator', {
            prompts: [ {
                type: 'list',
                name: 'generator',
                message: `${ chalk.blue('[PGEN]') } Please choose a generator.`,
                choices: plopList.map((plop) => ({
                    name: `${ plop.name }${ chalk.gray(Boolean(plop.description) ? ` - ${ plop.description }` : '') }`,
                    value: plop.name,
                })),
            } ],
        });
        return generator.runPrompts().then((results) => results.generator);
    },

    runPlop(generator) {
        generator.runPrompts()
            .then(generator.runActions)
            .then((result) => {
                result.changes.forEach((line) => {
                    console.log(chalk.green('[SUCCESS]'), line.type, Boolean(line.path) ? line.path : '');
                });
                result.failures.forEach((line) => {
                    console.log(chalk.red('[FAILED]'), line);
                });
            })
            .catch((err) => {
                console.error(chalk.red('[ERROR]'), err.message);
                process.exit(1);
            });
    },
};
