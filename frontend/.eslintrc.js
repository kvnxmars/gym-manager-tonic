module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'react-app',
    'react-app/jest'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      js: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Add custom rules here if needed
  }
};