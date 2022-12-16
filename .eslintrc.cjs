module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      files: [
        'config/index.js',
      ],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: [
        'assistant/commands/*.js',
      ],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
    {
      files: [
        'assistant/handler.js',
      ],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'import/extensions': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
  },
};
