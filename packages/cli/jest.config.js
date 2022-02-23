/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  rootDir: 'src',
  collectCoverageFrom: [
    "**/*.{ts}"
  ],
  coverageReporters: ["clover", "json", "lcov", 'html', 'text', 'text-summary']
};