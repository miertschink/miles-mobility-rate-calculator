export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/test/**/*.spec.ts'],
  coverageThreshold: {
    global: {
      statements: 50,
      functions: 50,
    },
  },
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
  maxWorkers: 1,
};
