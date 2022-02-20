module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'space-infix-ops': 'error',
		'keyword-spacing': 'error',
		'object-curly-spacing': ['error', 'always'],
		'comma-spacing': ['error', { before: false, after: true }],
		'arrow-spacing': 'error',
		'space-before-function-paren': ['error', 'always'],
		'no-trailing-spaces': 'error',
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
	},
}
