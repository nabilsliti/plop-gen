const globby = require('globby');
const util = require('util');
const fs = require('fs');
const directory = require('inquirer-directory');

const args = process.argv.slice(2);
const argv = require('minimist')(args);
const angular = require('./templates/angular/generator');
const react = require('./templates/react/generator');
const stencil = require('./templates/stencil/generator');
const vue = require('./templates/vue/generator');

const path = argv.cwd || process.cwd();
const frameworks = [ 'react', 'angular', 'vue', 'stencil' ];

const renameAsync = util.promisify(fs.rename);
const getOldName = (value) => value.match(/([^\/]*)\/*$/)[ 1 ];

function createComponent(data) {
    // eslint-disable-next-line no-param-reassign
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
    // eslint-disable-next-line no-param-reassign
    data.oldComponentName = getOldName(data.path);
    // eslint-disable-next-line no-param-reassign
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

function validateComponentName(value, framework) {
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
module.exports = function initPgen(pgen) {
    pgen.addPrompt('directory', directory);
    pgen.setGenerator('create-component', {
        description: 'Add a new component',
        prompts: [
            {
                type: 'list',
                name: 'framework',
                message: 'Which framework you like to use',
                choices: frameworks,
            },
            {
                type: 'input',
                name: 'componentName',
                message: 'Name of the component',
                validate: (value) => {
                    if ((/.+/).test(value)) {
                        return true;
                    }
                    return 'Component name is required';
                },
            },
            {
                type: 'directory',
                name: 'path',
                message: 'Where would you like to put this component?',
                basePath: path,
            },
        ],
        actions: createComponent,
    });

    pgen.setGenerator('rename-component', {
        description: 'Rename an existing component',
        prompts: [
            {
                type: 'directory',
                name: 'path',
                message: 'Choose the component to rename it',
                basePath: path,
            },
            {
                type: 'list',
                name: 'framework',
                message: 'Which framework this component based on',
                choices: frameworks,
            },
            {
                type: 'input',
                name: 'newComponentName',
                message: 'Enter the new name of the component',
                validate: (value, context) => validateComponentName(value, context.framework),
            },
        ],
        actions: renameComponent,
    });

    pgen.setActionType('renameComponent', async (answers) => {
        const oldDir = `${ answers.path }`;
        const templateFiles = globby.sync(oldDir, {
            expandDirectories: true,
        });

        const filesRenamed = [];
        templateFiles.forEach(async (filepath) => {
            const oldFileName = getOldName(filepath);
            const newFileName = oldFileName.replace(answers.oldComponentName, answers.newComponentName);
            const newFilepath = `${ oldDir }/${ newFileName }`;
            await renameAsync(filepath, newFilepath);
            filesRenamed.push(newFilepath);
        });
        const newDir = oldDir.replace(answers.oldComponentName, answers.newComponentName);
        await renameAsync(oldDir, newDir);

        const summary = `${ filesRenamed.length } files renamed`;
        console.log(summary);
    });
};
