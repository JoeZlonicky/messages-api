import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    rules: {
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.name,
      },
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.mjs'],
    ...ts.configs.disableTypeChecked,
  },
  prettier,
);
