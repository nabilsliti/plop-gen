
'use strict';
const { upperFirst, camelCase } = require('lodash');
const utils = require('../../utils');

module.exports = {
    createComponent: function (data) {
        const componentPath = data.componentPath;
        const actions = [];
        if (data.componentName) {
            // component
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.tsx`,
                templateFile: require.resolve('./component.tsx.hbs')
            });
    
            // sass file
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.scss`,
                templateFile: require.resolve('./component.scss.hbs')
            });
    
            // spec file
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.spec.ts`,
                templateFile: require.resolve('./component.spec.tsx.hbs')
            });
    
            // e2e file
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.e2e.ts`,
                templateFile: require.resolve('./component.e2e.tsx.hbs')
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
        // component
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.tsx`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.tsx`,
            pattern: new RegExp(`${ upperFirst(camelCase(oldComponentName)) }`, 'g'),
            template: '{{pascalCase newComponentName}}'
        });
    
        // e2e file
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.e2e.ts`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        // sass file
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.scss`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        // specs files
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.spec.ts`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });
    
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.spec.ts`,
            pattern: new RegExp(`${ upperFirst(camelCase(oldComponentName)) }`, 'g'),
            template: '{{pascalCase newComponentName}}'
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
        if (!utils.isKebabCased(value)) {
            return `Component name must be in kebab-case, actual value : [${ value }]`;
        }
        return true;
    }
}