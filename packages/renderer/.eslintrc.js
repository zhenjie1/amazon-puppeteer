module.exports = {
	env: {
		browser: true,
		node: true,
	},
	globals: {
		require: true,
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser', // Specifies the ESLint parser
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	extends: [
		'plugin:vue/vue3-recommended',
		// 'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:jsdoc/recommended',

		// 'plugin:vue/vue3-essential',
		// // 'eslint:recommended',
		// 'plugin:@typescript-eslint/eslint-recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:prettier/recommended',
		// 'prettier/vue',
		// 'prettier/@typescript-eslint',

		// 'plugin:jsdoc/recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:vue/vue3-recommended',

		// 'pligin:eslint-config-prettier',
		// 'pligin:eslint-config-prettier/vue',
		// 'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		// 'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	plugins: ['@typescript-eslint'],
	rules: {
		// 'prettier/prettier': 'off',
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		// 'vue/max-attributes-per-line': [
		// 	'error',
		// 	{
		// 		singleline: 3,
		// 		multiline: {
		// 			max: 1,
		// 			allowFirstLine: false,
		// 		},
		// 	},
		// ],
		'vue/no-mutating-props': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'vue/custom-event-name-casing': 'off',

		'accessor-pairs': 'error',
		'array-bracket-spacing': 'error',
		'array-callback-return': 'off',
		'arrow-body-style': ['off', 'always'],
		'arrow-parens': 'error',
		'arrow-spacing': 'error',
		'block-scoped-var': 'off',
		'block-spacing': 'error',
		'brace-style': 'off',
		'callback-return': 'off',
		camelcase: 'off',
		'comma-dangle': 0,
		'comma-spacing': 'error',
		'comma-style': ['error', 'last'],
		complexity: 'off',
		'computed-property-spacing': 'error',
		'consistent-return': 'off',
		'consistent-this': ['error', 'that'],
		curly: 'off',
		'default-case': 'off',
		'dot-location': ['error', 'property'],
		'dot-notation': 'error',
		'eol-last': 'error',
		eqeqeq: 'off',
		'func-names': 'off',
		'func-style': 'off',
		'generator-star-spacing': 'error',
		'guard-for-in': 'off',
		'handle-callback-err': 'error',
		'id-blacklist': 'error',
		'id-length': 'off',
		'id-match': 'error',
		indent: [
			'error',
			'tab',
			{
				VariableDeclarator: 1,
			},
		],
		'no-tabs': 'off',
		'init-declarations': 'off',
		'no-trailing-spaces': 'error',
		'key-spacing': 'off',
		'keyword-spacing': 'off',
		'linebreak-style': ['error', 'unix'],
		'lines-around-comment': 'off',
		'max-depth': 'off',
		'max-len': 'off',
		'max-lines': 'off',
		'max-nested-callbacks': 'error',
		'max-params': 'off',
		'max-statements': 'off',
		'max-statements-per-line': 'off',
		'new-parens': 'off',
		'new-cap': 'off',
		'newline-after-var': 'off',
		'newline-before-return': 'off',
		'newline-per-chained-call': 'off',
		'no-alert': 'off',
		'no-array-constructor': 'error',
		'no-bitwise': 'off',
		'no-caller': 'error',
		'no-catch-shadow': 'error',
		'no-confusing-arrow': 'off',
		// 'no-console': ['warn', { allow: ['info', 'warn', 'error', 'group', 'groupEnd', 'clear'] }],
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-continue': 'off',
		'no-div-regex': 'error',
		'no-duplicate-imports': 'error',
		'no-else-return': 'off',
		'no-empty-function': 'off',
		'no-eq-null': 'off',
		'no-eval': ['error', { allowIndirect: true }],
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-extra-label': 'error',
		'no-extra-parens': 'off',
		'no-floating-decimal': 'off',
		'no-implicit-coercion': ['error', { boolean: false, number: false, string: false }],
		'no-mixed-spaces-and-tabs': 'off',
		'no-implicit-globals': 'off',
		'no-implied-eval': 'error',
		'no-inline-comments': 'off',
		'no-inner-declarations': ['error', 'functions'],
		'no-invalid-this': 'off',
		'no-iterator': 'error',
		'no-label-var': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-lonely-if': 'off',
		'no-loop-func': 'off',
		'no-magic-numbers': 'off',
		'no-mixed-operators': 'off',
		'no-mixed-requires': 'error',
		'no-multi-spaces': 'error',
		'no-multi-str': 'off',
		'no-native-reassign': 'error',
		'no-negated-condition': 'off',
		'no-nested-ternary': 'off',
		'no-new': 'error',
		'no-new-func': 'off',
		'no-new-object': 'error',
		'no-new-require': 'error',
		'no-new-wrappers': 'error',
		'no-octal-escape': 'error',
		'no-param-reassign': 'off',
		'no-path-concat': 'error',
		'no-plusplus': 'off',
		'no-process-exit': 'off',
		'no-proto': 'off',
		'no-prototype-builtins': 'off',
		'no-restricted-globals': 'error',
		'no-restricted-imports': 'error',
		'no-restricted-modules': 'error',
		'no-restricted-syntax': ['error', 'WithStatement'],
		'no-return-assign': 'off',
		'no-script-url': 'off',
		'no-self-compare': 'off',
		'no-sequences': 'off',
		'no-shadow': 'off',
		'no-shadow-restricted-names': 'off',
		'no-spaced-func': 'error',
		'no-sync': 'off',
		'no-ternary': 'off',
		'no-throw-literal': 'error',
		'no-undef-init': 'error',
		'no-undef': 'off',
		'no-undefined': 'off',
		'no-underscore-dangle': 'off',
		'no-unmodified-loop-condition': 'error',
		'no-unneeded-ternary': 'error',
		'no-unsafe-finally': 'error',
		'no-unused-expressions': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
		'no-useless-call': 'off',
		'no-useless-computed-key': 'error',
		'no-useless-concat': 'off',
		'no-useless-constructor': 'error',
		'no-useless-escape': 'off',
		'no-useless-rename': 'error',
		'no-var': 'error',
		'no-void': 'off',
		'no-warning-comments': 'off',
		'no-whitespace-before-property': 'error',
		'no-with': 'error',
		'object-curly-newline': 'off',
		'object-curly-spacing': ['error', 'always'],
		'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
		'nonblock-statement-body-position': ['error'],
		'object-shorthand': 'off',
		'one-var': 'off',
		'one-var-declaration-per-line': 'off',
		'operator-assignment': 'off',
		'operator-linebreak': 'off',
		'padded-blocks': 'off',
		'prefer-arrow-callback': 'off',
		'prefer-const': 'error',
		'prefer-reflect': 'off',
		'prefer-rest-params': 'off',
		'prefer-spread': 'off',
		'prefer-template': 'off',
		'quote-props': 'off',
		quotes: ['error', 'single'],
		radix: 'off',
		'require-jsdoc': 'off',
		'require-yield': 'error',
		'rest-spread-spacing': 'error',
		semi: ['error', 'never'],
		'semi-spacing': 'off',
		'sort-imports': 'off',
		'sort-vars': 'off',
		'space-before-blocks': 'off',
		'space-before-function-paren': 0,
		'space-in-parens': 'off',
		'space-infix-ops': 'off',
		'space-unary-ops': ['error', { nonwords: false, words: false }],
		strict: 'off',
		'template-curly-spacing': 'error',
		'unicode-bom': ['error', 'never'],
		'valid-jsdoc': 'off',
		'vars-on-top': 'off',
		'wrap-iife': 'off',
		'wrap-regex': 'off',
		'yield-star-spacing': 'error',
		yoda: 'off',
		'spaced-comment': 'off',
		'no-extra-boolean-cast': 'off',
	},
}
