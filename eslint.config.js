// eslint.config.js (ESLint 9+ - flat config)
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // ignorar build/coverage
  { ignores: ['dist', 'coverage'] },

  // base JS recomendada
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }, // 👈 acá sí
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // hooks recomendadas
      ...reactHooks.configs.recommended.rules,

      // variables sin usar (permite MAYÚSCULAS tipo __DEV__)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Vite + React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
