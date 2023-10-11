'use strict';
const chalk = require('chalk');
const fs = require('fs');

module.exports = function createPlopFile(env) {
	try {
		const content = `module.exports = function (plop) {
	plop.setGenerator('controller', {
		description: 'application controller',

		// inquirer prompts
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'Controller name?'
		}],
		
		// actions to perform
		actions: [{
			type: 'add',
			path: 'src/controllers/{{dashCase name}}.js',
			templateFile: 'templates/controller.hbs',
		}]
	});
		
}`;
	fs.writeFileSync(`${ env.cwd }/plopfile.js`, content);
		console.log(chalk.green('[SUCCESS]'), 'The plopfile has been created');
	} catch (err) {
		console.error(err);
	}
};