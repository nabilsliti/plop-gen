const { upperFirst, camelCase, kebabCase } = require('lodash');

module.exports = {
    isKebabCased: value => value === kebabCase(value),

    isPascalCaseased: value => value === upperFirst(camelCase(value))
}