module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
      "^.+\\.jsx?$": "./wrapper.js",
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};