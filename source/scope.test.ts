import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { ScopeInterface, ScopeType, WalkType } from "./contracts/scope.js";
import { Scope } from "./scope.js";

describe.each([
  ["container", undefined],
  ["container", "parent"],
  ["request", undefined],
  ["request", "parent"],
])("new Scope(%p, %s)", (testType, testParent) => {
  let mockParent: MockProxy<ScopeInterface>;
  let scope: Scope;
  beforeEach(() => {
    mockParent = mock<ScopeInterface>();
    scope = testParent
      ? new Scope(testType as ScopeType, mockParent)
      : new Scope(testType as ScopeType);
  });
  afterEach(() => {
    mockReset(mockParent);
  });

  describe.each(["key", Symbol("key")])("clearRecord(%p)", (testKey) => {
    describe("when there is record", () => {
      beforeEach(() => scope.setRecord(testKey, "value"));
      it("should return self", () => {
        const self = scope.clearRecord(testKey);
        expect(self).toBe(scope);
      });
    });
    describe("when there is no record", () => {
      it("should return self", () => {
        const self = scope.clearRecord(testKey);
        expect(self).toBe(scope);
      });
    });
  });

  describe.each(["container", "request"])("fork(%p)", (testType) => {
    it("should return fork", () => {
      const fork = scope.fork(testType as ScopeType);
      expect(fork).toBeInstanceOf(Scope);
    });
  });

  describe("getParent()", () => {
    if (testParent)
      it("should return parent", () => {
        const parent = scope.getParent();
        expect(parent).toBe(mockParent);
      });
    else
      it("should return undefined", () => {
        const parent = scope.getParent();
        expect(parent).toBeUndefined();
      });
  });

  describe.each(["key", Symbol("key")])("getRecord(%p)", (testKey) => {
    describe("when there is record", () => {
      beforeEach(() => scope.setRecord(testKey, "value"));
      it("should return value", () => {
        const value = scope.getRecord(testKey);
        expect(value).toBe("value");
      });
    });
    describe("when there is no record", () => {
      beforeEach(() => mockParent.getRecord.mockReturnValue(undefined));
      it("should return undefined", () => {
        const value = scope.getRecord(testKey);
        expect(value).toBeUndefined();
      });
    });
  });

  describe("getType()", () => {
    it(`should return "${testType}"`, () => {
      const type = scope.getType();
      expect(type).toBe(testType);
    });
  });

  describe.each(["key", Symbol("key")])("hasRecord(%p)", (testKey) => {
    describe("when there is record", () => {
      beforeEach(() => scope.setRecord(testKey, "value"));
      it("should return true", () => {
        const exists = scope.hasRecord(testKey);
        expect(exists).toBeTrue();
      });
    });
    describe("and there is no record", () => {
      beforeEach(() => mockParent.hasRecord.mockReturnValue(false));
      it("should return false", () => {
        const exists = scope.hasRecord(testKey);
        expect(exists).toBeFalse();
      });
    });
  });

  describe.each([
    ["key", "value"],
    [Symbol("test"), "value"],
  ])("setRecord(%p, %p)", (testKey, testValue) => {
    describe("when there is record", () => {
      beforeEach(() => scope.setRecord(testKey, "value"));
      it("should return self", () => {
        const self = scope.setRecord(testKey, testValue);
        expect(self).toBe(scope);
      });
    });
    describe("when there is no record", () => {
      it("should return self", () => {
        const self = scope.setRecord(testKey, testValue);
        expect(self).toBe(scope);
      });
    });
  });

  describe.each(["container", "request", "singleton", "transient"])(
    "walkTo(%p)",
    (testWalkType) => {
      beforeEach(() => mockParent.walkTo.mockReturnValue(scope));
      it("should return scope", () => {
        const walkScope = scope.walkTo(testWalkType as WalkType);
        expect(walkScope).toBeInstanceOf(Scope);
      });
    },
  );
});
