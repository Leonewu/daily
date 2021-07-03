module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['cjs2esm/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/']
};