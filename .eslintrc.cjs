const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  globals: {
    beforeAll: true,
    afterAll: true,
  },

  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')],
      },
    },
    typescript: {
      alwaysTryTypes: true,
      project: path.resolve(__dirname, './tsconfig.json'),
    },
  },

  plugins: ['react', '@typescript-eslint'],

  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'react/jsx-fragments': [2, 'element'],
    'no-param-reassign': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    'react/destructuring-assignment': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // remove this after fully implementing typescript definitions
    'react/prop-types': 'off',
  },
  // need to define overrides for typescript since
  // the codebase is mixed. will remove this after migrating all
  // to adapt to typescript
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        // '@typescript-eslint/explicit-module-boundary-types': ['warn'],
      },
    },
  ],
};
