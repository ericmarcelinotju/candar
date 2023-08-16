module.exports = {
  env: {
    'vue/setup-compiler-macros': true
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.VITE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.VITE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-html': 'off',
    'jest/no-test-callback': 'off',
    'jest/no-commented-out-tests': 'off',
    'vue/no-unused-vars': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/attributes-order': ['error', { alphabetical: true }]
  },
  ignorePatterns: ['config/enums/*']
}
