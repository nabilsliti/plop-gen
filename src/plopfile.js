'use strict';
const globby = require('globby');
const util = require('util');
const fs = require('fs');
const args = process.argv.slice(2);
const argv = require('minimist')(args);
const angular = require('./templates/angular/generator')
const react = require('./templates/react/generator')
const stencil = require('./templates/stencil/generator')
const vue = require('./templates/vue/generator')

const path = argv.cwd || process.cwd();
const frameworks = [ 'react', 'angular', 'vue', 'stencil' ];

const renameAsync = util.promisify(fs.rename);
const getOldName = value => value.match(/([^\/]*)\/*$/)[1];

function createComponent(data) {
    data.componentPath = `${ path }/${ data.path }`;
    switch (data.framework) {
        case 'stencil':
            return stencil.createComponent(data);
        case 'react':
            return react.createComponent(data);
        case 'angular':
            return angular.createComponent(data);
        case 'vue':
            return vue.createComponent(data);
        default:
            return [];
    }
}

function renameComponent(data) {
    data.oldComponentName = getOldName(data.path);
    data.path = `${ path }/${ data.path }`;
    switch (data.framework) {
        case 'stencil':
            return stencil.renameComponent(data);
        case 'react':
            return react.renameComponent(data);
        case 'angular':
            return angular.renameComponent(data);
        case 'vue':
            return vue.renameComponent(data);
        default:
            return [];
    }
}

function validateComponentName (value, framework) {
    switch (framework) {
        case 'stencil':
            return stencil.validateComponentName(value);
        case 'react':
            return react.validateComponentName(value);
        case 'angular':
            return angular.validateComponentName(value);
        case 'vue':
            return vue.validateComponentName(value);
        default:
            return true;
    }
}
module.exports = function (plop) {
	plop.addPrompt('directory', require('inquirer-directory'));
	
	plop.setGenerator('create-component', {
		description: 'add a new component',
		prompts: [
            {
				type: 'list',
				name: 'framework',
				message: 'Which framework you like to use',
                choices: frameworks
			},
			{
				type: 'input',
				name: 'componentName',
				message: 'Name of the component',
				validate: value => {
					if ((/.+/).test(value)) {
						return true;
					}
					return 'Component name is required';
				}
			},
			{
				type: 'directory',
				name: 'path',
				message: 'where would you like to put this component?',
				basePath: path
			}
		],
		actions: createComponent
	});

	plop.setGenerator('rename-component', {
		description: 'rename an existing component',
        prompts: [
            {
                type: 'directory',
                name: 'path',
                message: 'Choose the component to rename it',
                basePath: path
            },
            {
				type: 'list',
				name: 'framework',
				message: 'Which framework this component based on',
                choices: frameworks
			},
            {
                type: 'input',
                name: 'newComponentName',
                message: 'Enter the new name of the component',
                validate: (value, context) => validateComponentName(value, context.framework),
            },
        ],
        actions: renameComponent
	});

	plop.setActionType('renameComponent', async function (answers) {
        const oldDir = `${ answers.path }`;
        const templateFiles = globby.sync(oldDir, {
            expandDirectories: true
        });

        const filesRenamed = [];
        for (let filepath of templateFiles) {
            const oldFileName = getOldName(filepath);
            const newFileName = oldFileName.replace(answers.oldComponentName, answers.newComponentName);
            const newFilepath = `${ oldDir }/${ newFileName }`;
            if (typeof newFileName === 'string') {
                await renameAsync(filepath, newFilepath);
                filesRenamed.push(newFilepath)
            }
        }
        const newDir = oldDir.replace(answers.oldComponentName, answers.newComponentName);
        await renameAsync(oldDir, newDir);

        const summary = `${ filesRenamed.length } files renamed`;
        console.log(summary);
    });
};