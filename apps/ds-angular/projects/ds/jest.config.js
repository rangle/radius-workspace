const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['../../setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'projects/ds/tsconfig.spec.json',
    },
  },
};
