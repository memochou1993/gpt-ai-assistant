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
        'app/commands/*.js',
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
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    'no-console': 'off',
    'no-param-reassign': 'off',
  },
};
