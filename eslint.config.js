import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import typescript from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import node from 'eslint-plugin-node';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended,
  resolvePluginsRelativeTo: import.meta.url,
});

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        document: true,
        fetch: true,
        window: true,
        console: true,
        module: true,
        require: true,
        __dirname: true,
        caches: true,
        Response: true,
        self: true,
        process: 'readonly',
        DATABASE_URL: 'readonly',
        LOG_LEVEL: 'readonly',
        ORIGIN_CERTIFICATE_PATH: 'readonly',
        ORIGIN_CERTIFICATE_KEY_PATH: 'readonly',
        ROOT_CA_PATH: 'readonly',
        TUNNEL_TOKEN: 'readonly',
        TUNNEL_CONNECTOR_ID: 'readonly',
        TUNNEL_SERVICE_URL: 'readonly',
        TUNNEL_PUBLIC_HOSTNAME: 'readonly',
        PORT: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      '@typescript-eslint': typescript,
      prettier,
      node,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-console': 'off', // Turn off no-console rule
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 80,
          tabWidth: 2,
          semi: true,
        },
      ],
    },
  },
  ...compat.extends('eslint:recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:node/recommended'),
  ...compat.extends('prettier'),
];
