const { camelCase } = require('lodash');
const utils = require('../../utils');

module.exports = {
    createComponent(data) {
        const { componentPath } = data;
        const actions = [];
        if (data.componentName) {
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/index.ts`,
                templateFile: require.resolve('./index.ts.hbs'),
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.tsx`,
                templateFile: require.resolve('./component.tsx.hbs'),
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.test.tsx`,
                templateFile: require.resolve('./component.test.tsx.hbs'),
            });
            actions.push({
                type: 'add',
                path: `${ componentPath }/{{pascalCase componentName}}/{{pascalCase componentName}}.module.css`,
                templateFile: require.resolve('./component.module.css.hbs'),
            });
        } else {
            throw Error('you need a component name');
        }

        return actions;
    },

    renameComponent(data) {
        const componentPath = data.path;
        const { oldComponentName } = data;
        const actions = [];
        actions.push({
            type: 'modify',
            path: `${ componentPath }/index.ts`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}',
        });
        // component
        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.tsx`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}',
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.tsx`,
            pattern: new RegExp(`${ camelCase(oldComponentName) }`, 'g'),
            template: '{{camelCase newComponentName}}',
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.test.tsx`,
            pattern: new RegExp(`${ oldComponentName }`, 'g'),
            template: '{{newComponentName}}',
        });

        actions.push({
            type: 'modify',
            path: `${ componentPath }/${ oldComponentName }.module.css`,
            pattern: new RegExp(`${ camelCase(oldComponentName) }`, 'g'),
            template: '{{camelCase newComponentName}}',
        });

        // rename files and component directory
        actions.push({
            type: 'renameComponent',
            speed: 'slow',
            template: '{{newComponentName}}',
        });

        return actions;
    },

    validateComponentName(value) {
        if (!utils.isPascalCaseased(value)) {
            return `Component id must be in pascalCase, actual value : [${ value }]`;
        }
        return true;
    },
};
