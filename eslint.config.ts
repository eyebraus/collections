import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import preferArrow from 'eslint-plugin-prefer-arrow';
import { defineConfig } from 'eslint/config';
import tslint from 'typescript-eslint';

export default defineConfig(
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['dist/**', 'node_modules/**'],
    },
    eslint.configs.recommended,
    {
        plugins: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'prefer-arrow': preferArrow,
        },
        rules: {
            // Disabled ESLint rules
            'class-methods-use-this': 'off',
            'consistent-return': 'off',
            'constructor-super': 'off',
            'default-param-last': 'off',
            'dot-notation': 'off',
            'init-declarations': 'off',
            'max-params': 'off',
            'no-array-constructor': 'off',
            'no-dupe-class-members': 'off',
            'no-empty-function': 'off',
            'no-implied-eval': 'off',
            'no-invalid-this': 'off',
            'no-loop-func': 'off',
            'no-magic-numbers': 'off',
            'no-redeclare': 'off',
            'no-return-await': 'off',
            'no-shadow': 'off',
            'no-throw-literal': 'off',
            'no-unused-expressions': 'off',
            'no-unused-vars': 'off',
            'no-use-before-define': 'off',
            'no-useless-constructor': 'off',
            'prefer-destructuring': 'off',
            'require-await': 'off',

            // ESLint rules
            'array-callback-return': 'error',
            'arrow-body-style': 'error',
            curly: 'error',
            'default-case-last': 'error',
            eqeqeq: 'error',
            'no-alert': 'error',
            'no-await-in-loop': 'error',
            'no-constructor-return': 'error',
            'no-duplicate-imports': 'error',
            'no-else-return': 'error',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-inline-comments': 'error',
            'no-lonely-if': 'error',
            'no-multi-assign': 'error',
            'no-param-reassign': 'error',
            'no-return-assign': 'error',
            'no-sequences': 'error',
            'no-template-curly-in-string': 'error',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-rename': 'error',
            'no-var': 'error',
            'no-void': ['error', { allowAsStatement: true }],
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-object-has-own': 'error',
            'prefer-object-spread': 'error',
            'prefer-regex-literals': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',

            // Custom plugins
            'prefer-arrow/prefer-arrow-functions': 'error',
        },
    },
    ...tslint.configs.strictTypeChecked,
    ...tslint.configs.stylisticTypeCheckedOnly,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.ts'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // @typescript-eslint rules (https://typescript-eslint.io/rules/)
            '@typescript-eslint/class-methods-use-this': [
                'error',
                {
                    ignoreClassesThatImplementAnInterface: 'public-fields',
                    ignoreOverrideMethods: true,
                },
            ],
            '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    fixStyle: 'inline-type-imports',
                    prefer: 'type-imports',
                },
            ],
            '@typescript-eslint/default-param-last': 'error',
            '@typescript-eslint/dot-notation': [
                'error',
                {
                    allowKeywords: false,
                },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/init-declarations': 'error',
            '@typescript-eslint/max-params': ['warn', { max: 5 }],
            '@typescript-eslint/method-signature-style': ['error', 'property'],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    format: ['strictCamelCase'],
                    leadingUnderscore: 'forbid',
                    selector: 'default',
                    trailingUnderscore: 'forbid',
                },
                {
                    format: ['StrictPascalCase'],
                    leadingUnderscore: 'forbid',
                    selector: ['enumMember', 'typeLike'],
                    trailingUnderscore: 'forbid',
                },
                {
                    format: ['PascalCase'],
                    leadingUnderscore: 'forbid',
                    selector: ['typeParameter'],
                    trailingUnderscore: 'forbid',
                },
                {
                    format: null,
                    leadingUnderscore: 'allow',
                    selector: ['objectLiteralProperty'],
                    trailingUnderscore: 'allow',
                },
                {
                    format: ['strictCamelCase', 'StrictPascalCase'],
                    leadingUnderscore: 'allow',
                    selector: ['variableLike'],
                    trailingUnderscore: 'forbid',
                },
            ],
            '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
            '@typescript-eslint/no-loop-func': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-shadow': 'warn',
            '@typescript-eslint/no-unsafe-type-assertion': 'warn',
            '@typescript-eslint/no-use-before-define': ['error', { typedefs: false }],
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/non-nullable-type-assertion-style': 'error',
            '@typescript-eslint/prefer-destructuring': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-literal-enum-member': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowBoolean: true,
                    allowNumber: true,
                },
            ],
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
        },
    },
    {
        ...perfectionist.configs['recommended-natural'],
        ignores: ['**/*.config.ts'],
    },
    {
        rules: {
            'perfectionist/sort-named-imports': 'off',
        },
    },
);
