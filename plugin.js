const specificity = require('css-specificity');

module.exports = (opts = {}) => {
    return {
        postcssPlugin: 'CSS Specificity',
        Rule (rule) {
            let { selector } = rule;
            let specs = specificity.calc(selector);

            rule.selector = specs.map(spec => `/* ${spec.specificity.join('')} */ ${spec.selector}`).join(',\n');
        }
    };
};

module.exports.postcss = true;
