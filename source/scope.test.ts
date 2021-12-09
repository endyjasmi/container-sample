import { ScopeTo, ScopeType } from "./contracts/scope.js";
import { Scope } from "./scope.js";

describe("Scope", () => {
  describe.each([
    ["container", undefined],
    ["container", new Scope("container")],
    ["container", new Scope("request")],
    ["request", undefined],
    ["request", new Scope("container")],
    ["request", new Scope("request")],
  ])("new Scope(%p, %p)", (type, parent) => {
    let scope: Scope;
    beforeEach(() => (scope = new Scope(type as ScopeType, parent)));

    describe("get parent()", () => {
      it(`it should returns ${parent ? "parent" : "undefined"}`, () => {
        expect(scope.parent).toBe(parent);
      });
    });

    describe("get type()", () => {
      it(`should returns "${type}"`, () => {
        expect(scope.type).toBe(type);
      });
    });

    describe.each(["key", Symbol("key")])("clear(%p)", (key) => {
      describe("when there is record", () => {
        beforeEach(() => scope.set(key, "value"));
        it("should returns self", () => {
          const self = scope.clear(key);
          expect(self).toBe(scope);
        });
      });
      describe("when there is no record", () => {
        it("should returns self", () => {
          const self = scope.clear(key);
          expect(self).toBe(scope);
        });
      });
    });

    describe.each(["container", "request"])("fork(%p)", (type) => {
      it("should returns fork", () => {
        const fork = scope.fork(type as ScopeType);
        expect(fork).toBeInstanceOf(Scope);
        expect(fork.parent).toBe(scope);
      });
    });

    describe.each(["key", Symbol("key")])("get(%p)", (key) => {
      describe("when there is record", () => {
        beforeEach(() => scope.set(key, "value"));
        it("should returns value", () => {
          const value = scope.get(key);
          expect(value).toBe("value");
        });
      });
      describe("when there is no record", () => {
        it("should returns undefined", () => {
          const value = scope.get(key);
          expect(value).toBeUndefined();
        });
      });
    });

    describe.each(["key", Symbol("key")])("has(%p)", (key) => {
      describe("when there is record", () => {
        beforeEach(() => scope.set(key, "value"));
        it("should returns true", () => {
          const result = scope.has(key);
          expect(result).toBeTrue();
        });
      });
      describe("when there is no record", () => {
        it("should returns false", () => {
          const result = scope.has(key);
          expect(result).toBeFalse();
        });
      });
    });

    describe.each(["key", Symbol("key")])('set(%p, "value")', (key) => {
      describe("when there is record", () => {
        beforeEach(() => scope.set(key, "value"));
        it("should returns self", () => {
          const self = scope.set(key, "value");
          expect(self).toBe(scope);
        });
      });
      describe("when there is no record", () => {
        it("should returns self", () => {
          const self = scope.set(key, "value");
          expect(self).toBe(scope);
        });
      });
    });

    describe.each(["container", "request", "singleton", "transient"])(
      "to(%p)",
      (type) => {
        it("should returns scope", () => {
          const result = scope.to(type as ScopeTo);
          expect(result).toBeInstanceOf(Scope);
        });
      },
    );
  });
});
