module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$'],
  coverageReporters: ['html', 'text', 'text-summary']
};
