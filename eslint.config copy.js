import parser from '@typescript-eslint/parser'
import plugin from '@typescript-eslint/eslint-plugin'
import js from '@eslint/js'

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': plugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...plugin.configs['recommended-type-checked'].rules,
            
            "@typescript-eslint/no-misused-promises": ["error", {
                checksVoidReturn: false,
                checksConditionals: true,
                checksSpreads: true
            }],
            '@typescript-eslint/explicit-function-return-type': ['error', {
                allowExpressions: false,
                allowConciseArrowFunctionExpressionsStartingWithVoid: false,
            }],
            '@typescript-eslint/typedef': ['warn', {
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: false,
                arrayDestructuring: false,
                objectDestructuring: false,
            }],
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            "@typescript-eslint/no-unused-expressions": "error",
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/return-await": ["error", "always"],
            'prefer-const': 'warn',
            "no-undef": "off",
        },
    },
]