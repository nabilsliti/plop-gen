
'use strict';
const { camelCase } = require('lodash');
const utils = require('../../utils');

module.exports = {
    createComponent: function (data) {
        const componentPath = data.componentPath;
        const actions = [];
        if (data.componentName) {
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.vue`,
                templateFile: require.resolve('./component.vue.hbs')
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.scss`,
                templateFile: require.resolve('./component.scss.hbs')
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.spec.js`,
                templateFile: require.resolve('./component.spec.js.hbs')
            });
        } else {
            throw Error(`you need a component name`);
        }
    
        return actions;
    },
    
    renameComponent: function(data) {
        const componentPath = data.path;
        const oldComponentName = data.oldComponentName;
        const actions = [];
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.vue`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.scss`,
            pattern: new RegExp(`${ camelCase(oldComponentName) }`, 'g'),
            template: '{{camelCase newComponentName}}'
        });
    
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.spec.js`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        // rename files and component directory
        actions.push({
            type: 'renameComponent',
            speed: 'slow',
            template: '{{newComponentName}}',
        });
    
        return actions;
    },
    
    validateComponentName: function(value) {
        if (!utils.isPascalCaseased(value)) {
            return `Component id must be in pascalCase, actual value : [${ value }]`;
        }
        return true;
    }
}