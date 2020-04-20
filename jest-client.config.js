module.exports = {
  name: 'client',
  displayName: 'client',
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  rootDir: 'source/client',
  globals: {
    'ts-jest': {
      tsConfig: {
        module: "ES6"
      }
    }
  }
};
