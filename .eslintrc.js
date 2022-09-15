// https://eslint.org/docs/user-guide/configuring
const path = require('path');

module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    babelOptions:
    {
      configFile: path.resolve(__dirname, './babel.config.js')
    }
  },
  env: {
    browser: true
  },
  extends: ['plugin:vue/recommended', '@vue/standard'],
  plugins: ['vuetify'],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    'spaced-comment': 'off',
    'no-var': ['error'],
    'brace-style': ['error', 'allman'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
          consistent: true
        },
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3
        }
      }
    ],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: false }
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'one-var': [
      'error',
      {
        uninitialized: 'always',
        initialized: 'never'
      }
    ],
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: {
          max: 6,
          allowFirstLine: true
        }
      }
    ],
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives'],
          ['provide', 'inject'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'data',
          'filters',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'ROUTER_GUARDS',
          'methods',
          ['template', 'render'],
          'renderError'
        ]
      }
    ],
    'vue/attribute-hyphenation': ['error', 'always', {
      ignore: []
    }],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always'
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always'
    }],
    'vue/html-end-tags': 'error',
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    'vue/html-quotes': ['error', 'double', { avoidEscape: true }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/multiline-html-element-content-newline': 'error',
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/no-multi-spaces': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/no-template-shadow': ['error'],
    'vue/one-component-per-file': ['error'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/v-slot-style': 'warn',
    'vue/attributes-order': 'error',
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style']
    }],
    'vue/no-lone-template': 'error',
    'vue/no-multiple-slot-args': 'warn',
    'vue/no-v-html': 'warn',
    'vue/this-in-template': ['error', 'never'],
    'vue/custom-event-name-casing': ['error',
      'kebab-case',
      {
        ignores: []
      }
    ],
    'vue/html-comment-content-newline': ['error',
      {
        singleline: 'never',
        multiline: 'always',
      },
      {
        exceptions: []
      }
    ],
    'vue/html-comment-content-spacing': ['error',
      'always',
      {
        exceptions: []
      }
    ],
    'vue/html-comment-indent': 'off',
    'vue/match-component-file-name': ['error', {
      extensions: ['vue'],
      shouldMatchCase: true
    }],
    'vue/next-tick-style': ['error', 'callback'],
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-empty-component-block': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-potential-component-option-typo': ['error', {
      presets: ['all'],
      custom: ['test']
    }],
    'vue/no-reserved-component-names': ['error', {
      disallowVueBuiltInComponents: true,
      disallowVue3BuiltInComponents: true
    }],
    'vue/no-template-target-blank': 'error',
    'vue/no-unused-properties': ['error', {
      groups: ['props', 'data', 'computed'],
      deepData: false,
      ignorePublicMembers: false
    }],
    'vue/no-useless-mustaches': ['error', {
      ignoreIncludesComment: false,
      ignoreStringEscape: false
    }],
    'vue/no-useless-v-bind': ['error'],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/require-direct-export': ['error', {
      disallowFunctionalComponentFunction: true
    }],
    'vue/require-name-property': 'error',
    'vue/v-for-delimiter-style': ['error', 'in'],
    'vue/v-on-event-hyphenation': ['error', 'always', {
      autofix: false,
      ignore: []
    }],
    'vue/v-on-function-call': 'error',
    'vue/valid-next-tick': 'error',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/key-spacing': 'error',
    'vue/valid-v-slot': ['error', {
      allowModifiers: true
    }],
  }
};
