'use strict';
const nodePlop = require('node-plop');
const chalk = require('chalk');

module.exports = {
    chooseGenerator: function(plopList, message) {
        const defaultChoosingMessage = chalk.blue('[PGEN]') + ' Please choose a generator.';
        const plop = nodePlop();
        const generator = plop.setGenerator('choose', {
            prompts: [{
                type: 'list',
                name: 'generator',
                message: message || defaultChoosingMessage,
                choices: plopList.map(function (p) {
                    return {
                        name: p.name + chalk.gray(!!p.description ? ' - ' + p.description : ''),
                        value: p.name
                    };
                })
            }]
        });
        return generator.runPrompts().then(results => results.generator);
    },

    runPlop: function(generator) {
        generator.runPrompts()
            .then(generator.runActions)
            .then(function (result) {
                result.changes.forEach(function(line) {
                    console.log(chalk.green('[SUCCESS]'), line.type, Boolean(line.path) ? line.path : '');
                });
                result.failures.forEach(function (line) {
                    console.log(chalk.red('[FAILED]'), line);
                });
            })
            .catch(function (err) {
                console.error(chalk.red('[ERROR]'), err.message);
                process.exit(1);
            });
    },
};