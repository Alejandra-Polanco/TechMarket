import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Carpetas que ESLint no debe revisar
  globalIgnores([
    'dist',
    'node_modules',
    'backend/node_modules',
    'backend/generated',
    'ferreteria-react',
  ]),

  // FRONTEND - React / navegador
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // El proyecto ya utiliza carga de datos dentro de useEffect.
      // Evitamos que ESLint marque ese patrón como error.
      'react-hooks/set-state-in-effect': 'off',

      // Algunos Context y archivos compartidos exportan funciones
      // además de componentes.
      'react-refresh/only-export-components': 'off',
    },
  },

  // BACKEND - Node.js / Express / Prisma
  {
    files: ['backend/**/*.js'],

    extends: [
      js.configs.recommended,
    ],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
])