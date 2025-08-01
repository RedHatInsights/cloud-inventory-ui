const transformIgnorePatterns = ['node_modules/(?!(uuid)/)'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel-esm',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.tsx',
    'src/**/*.ts',
    '!src/**/stories/*',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  // Ignore App and Routing in test config
  // Much of this is difficult to test outside the context of the crc platform
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'App.tsx',
    'AppEntry.tsx',
    'Routing.tsx',
    'entry.ts',
    'state/notificationsAtom.ts',
    'Components/util/testing/',
  ],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^uuid$': 'uuid',
  },
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
};
