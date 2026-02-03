const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    '^@workspace/data$': '<rootDir>/libs/data/src/index.ts',
    '^@workspace/data/(.*)$': '<rootDir>/libs/data/src/$1',
    '^@workspace/auth$': '<rootDir>/libs/auth/src/index.ts',
    '^@workspace/auth/(.*)$': '<rootDir>/libs/auth/src/$1',
  },
};
