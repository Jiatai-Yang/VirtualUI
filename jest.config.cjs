module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'CommonJS', target: 'ES2022', esModuleInterop: true } }] },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@virtuui/hooks$': '<rootDir>/packages/hooks/src/index.ts',
    '^@virtuui/tokens$': '<rootDir>/packages/tokens/src/index.ts',
    '^@virtuui/governance$': '<rootDir>/packages/governance/src/index.ts',
    '\\.(css)$': '<rootDir>/scripts/style-mock.cjs'
  },
  setupFilesAfterEnv: ['<rootDir>/scripts/test-setup.ts'],
  collectCoverageFrom: ['packages/{react,hooks,tokens,governance}/src/**/*.{ts,tsx}', '!**/*.test.*'],
  coverageThreshold: { global: { branches: 65, functions: 75, lines: 80, statements: 80 } }
};
