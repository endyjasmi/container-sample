import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  setupFilesAfterEnv: ["jest-extended/all"],
};
export default config;
