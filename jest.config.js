/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  modulePathIgnorePatterns: ["<rootDir>/app/"],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
