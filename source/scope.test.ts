import { ScopeType, WalkType } from "./contracts/scope.js";
import { Scope } from "./scope.js";

describe("Scope", () => {
  describe.each([
    ["container", undefined],
    ["container", new Scope("container")],
    ["container", new Scope("request")],
    ["request", undefined],
    ["request", new Scope("container")],
    ["request", new Scope("request")],
  ])("new Scope(%p, %p)", (scopeType, scopeParent) => {
    let scope: Scope;
    beforeEach(() => (scope = new Scope(scopeType as ScopeType, scopeParent)));

    describe.each(["key", Symbol("key")])("clearRecord(%p)", (key) => {
      describe("when there is record", () => {
        beforeEach(() => scope.setRecord(key, "value"));
        it("should returns self", () => {
          const self = scope.clearRecord(key);
          expect(self).toBe(scope);
        });
      });
      describe("when there is no record", () => {
        it("should returns self", () => {
          const self = scope.clearRecord(key);
          expect(self).toBe(scope);
        });
      });
    });

    describe.each(["container", "request"])("fork(%p)", (forkType) => {
      it("should returns fork", () => {
        const fork = scope.fork(forkType as ScopeType);
        expect(fork).toBeInstanceOf(Scope);
        expect(fork.getParent()).toBe(scope);
      });
    });

    describe("getParent()", () => {
      it(`it should returns ${scopeParent ? "parent" : "undefined"}`, () => {
        const parent = scope.getParent();
        expect(parent).toBe(scopeParent);
      });
    });

    describe.each(["key", Symbol("key")])("getRecord(%p)", (recordKey) => {
      describe("when there is record", () => {
        beforeEach(() => scope.setRecord(recordKey, "value"));
        it("should returns value", () => {
          const value = scope.getRecord(recordKey);
          expect(value).toBe("value");
        });
      });
      describe("when there is no record", () => {
        it("should returns undefined", () => {
          const value = scope.getRecord(recordKey);
          expect(value).toBeUndefined();
        });
      });
    });

    describe("getType()", () => {
      it(`should returns "${scopeType}"`, () => {
        const type = scope.getType();
        expect(type).toBe(scopeType);
      });
    });

    describe.each(["key", Symbol("key")])("hasRecord(%p)", (recordKey) => {
      describe("when there is record", () => {
        beforeEach(() => scope.setRecord(recordKey, "value"));
        it("should returns true", () => {
          const result = scope.hasRecord(recordKey);
          expect(result).toBeTrue();
        });
      });
      describe("when there is no record", () => {
        it("should returns false", () => {
          const result = scope.hasRecord(recordKey);
          expect(result).toBeFalse();
        });
      });
    });

    describe.each(["key", Symbol("key")])(
      'setRecord(%p, "value")',
      (recordKey) => {
        describe("when there is record", () => {
          beforeEach(() => scope.setRecord(recordKey, "value"));
          it("should returns self", () => {
            const self = scope.setRecord(recordKey, "value");
            expect(self).toBe(scope);
          });
        });
        describe("when there is no record", () => {
          it("should returns self", () => {
            const self = scope.setRecord(recordKey, "value");
            expect(self).toBe(scope);
          });
        });
      },
    );

    describe.each(["container", "request", "singleton", "transient"])(
      "walkTo(%p)",
      (walkType) => {
        it("should returns scope", () => {
          const result = scope.walkTo(walkType as WalkType);
          expect(result).toBeInstanceOf(Scope);
        });
      },
    );
  });
});
