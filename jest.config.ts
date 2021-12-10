import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  globals: { "ts-jest": { useESM: true } },
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  preset: "ts-jest/presets/default-esm",
  reporters: [],
  roots: ["<rootDir>/source/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
export default config;
