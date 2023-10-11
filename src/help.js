'use strict';
const chalk = require('chalk');
const boxen = require('boxen')
const version = require('./version');

module.exports = function help() {
	console.log([
		chalk.keyword('violet')(boxen(chalk.green("         PGEN: Generator based on plop \nGenerate components in angular, react, vue and stencil"), {padding:1, borderColor: 'green', dimBorder: true})),
		`${ chalk.bold('Version:')} ${chalk.blue(version)}`,
		chalk.bold('Usage:'),
		'  $ pgen                 ' + chalk.dim('Select from a list of available generators'),
		'  $ pgen <name>          ' + chalk.dim('Run a generator registered under that name'),
		chalk.bold('Options:'),
		'  -h, --help             ' + chalk.dim('Show this help'),
		'  -i, --init             ' + chalk.dim('Create a basic plopfile.js'),
		'  -p, --plopfile         ' + chalk.dim('Path to the plopfile'),
		'  -v, --version          ' + chalk.dim('Display current version'),
		'  --cwd                  ' + chalk.dim('Directory from which relative paths are calculated against'),
		chalk.bold('Examples:'),
		'  $ pgen',
		'  $ pgen create-component --cwd /path/where/you/will/create/your/component',
		'  $ pgen rename-component',
	].join('\n'));
};
