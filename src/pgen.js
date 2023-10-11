#!/usr/bin/env node
'use strict';
const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const nodePlop = require('node-plop');

const help = require('./help');
const createPlopFile = require('./create-plop-file');
const generator = require('./generator');
const version = require('./version');

const Plop = new Liftoff({
	name: 'pgen',
	processTitle: 'pgen'
});

Plop.launch({
	cwd: argv.cwd,
	configPath: argv.plopfile
}, run);

function run(env) {
	// Help
	if (argv.help || argv.h) {
		help();
		process.exit(0);
	}

	// Create plopfile
	if (argv.init || argv.i) {
		createPlopFile(env)
		process.exit(0);
	}

	// Package version
	if (argv.version || argv.v) {
		console.log(chalk.bold(version));
		process.exit(0);
	}

	// No plopfile found 
	if (argv.plopfile && !Boolean(env.configPath)) {
		console.error(chalk.red('[PGEN] ') + `Could not find the plopfile ${ chalk.yellow(argv.plopfile) }`);
		console.error(chalk.yellow('[PGEN] ') + `You can create a plopfile by running this command: ${ chalk.yellow('pgen --init') } or ${ chalk.yellow('pgen -i') }`);
		process.exit(1);
	}
	
	//Plop
	const plopfilePath = env.configPath || require.resolve('./plopfile.js');
	const plop = nodePlop(plopfilePath);

	//Generators
	const generators = plop.getGeneratorList();
	const generatorNames = generators.map(generator => generator.name);
	const generatorName = argv._[0];
	const isGeneratorFound = Boolean(generatorNames.find(generator => generator === generatorName));

	if (generatorName) { // has a generatorName in arguments (ex: $pgen create-component)
		if (isGeneratorFound) {
			generator.runPlop(plop.getGenerator(generatorName));
		} else {
			console.error(chalk.red('[PGEN] ') + `Could not find the generator : ${ chalk.gray(generatorName) }`);
			process.exit(1);
		}
	} else { // No generatorName in arguments (ex: $pgen)
		if (generators.length === 0) { // No generator found in plopfile
			console.error(chalk.red('[PGEN] ') + 'No generator found in plopfile');
			process.exit(1);
		} else if (generators.length === 1) { // Has one generator in plop file
			generator.runPlop(plop.getGenerator(generatorNames[0]));
		} else {
			generator.chooseGenerator(generators, plop.getWelcomeMessage()).then(function (generatorName) {
				generator.runPlop(plop.getGenerator(generatorName));
			});
		}
	}
}
