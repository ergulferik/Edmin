import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.app.json',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        File: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jsdoc: jsdocPlugin
    },
    rules: {
      "no-unused-vars": "off",
      '@typescript-eslint/no-unused-vars': ['warn', {        
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'jsdoc/require-jsdoc': ['warn', {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: false,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          ClassExpression: false,
          FunctionExpression: false
        }
      }],
      'jsdoc/require-description': ['warn', {
        contexts: ['ClassDeclaration', 'TSInterfaceDeclaration']
      }],
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'public/',
      '*.config.js',
      '*.config.ts',
      '.angular/cache/**'
    ]
  }
];
