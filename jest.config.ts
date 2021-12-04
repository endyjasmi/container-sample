import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  roots: ["<rootDir>/source/"],
  setupFilesAfterEnv: ["jest-extended/all"],
};
export default config;
