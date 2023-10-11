
'use strict';
const { upperFirst, camelCase } = require('lodash');
const utils = require('../../utils');

module.exports = {
    createComponent: function(data) {
        const componentPath = data.componentPath;
        const actions = [];
        if (data.componentName) {
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.component.html`,
                templateFile: require.resolve('./component.html.hbs')
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.component.ts`,
                templateFile: require.resolve('./component.ts.hbs')
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.component.css`,
                templateFile: require.resolve('./component.css.hbs')
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{dashCase componentName}}/{{dashCase componentName}}.component.spec.ts`,
                templateFile: require.resolve('./component.spec.ts.hbs')
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
        //component
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.html`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.ts`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.ts`,
            pattern: new RegExp(`${ upperFirst(camelCase(oldComponentName)) }`, 'g'),
            template: '{{pascalCase newComponentName}}'
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.css`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.spec.ts`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}'
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.component.spec.ts`,
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
            return `Component id must be in kebab-case, actual value : [${ value }]`;
        }
        return true;
    }
}