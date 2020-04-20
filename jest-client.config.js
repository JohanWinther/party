module.exports = {
  name: 'client',
  displayName: 'client',
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  roots: [
    "<rootDir>/source/client"
  ],
  globals: {
    'ts-jest': {
      tsConfig: {
        "typeRoots": [
          "./node_modules/@types"
        ]
      }
    }
  }
};
