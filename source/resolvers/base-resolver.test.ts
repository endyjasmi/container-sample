import { mock, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ResolverKey, ResolverScope } from "../contracts/resolver.js";
import { ResolverError } from "../errors/resolver-error.js";
import { Scope } from "../scope.js";
import { BaseResolver } from "./base-resolver.js";

describe("BaseResolver", () => {
  let registry: RegistryInterface;
  let resolver: BaseResolver;
  beforeEach(() => (registry = mock<RegistryInterface>()));
  beforeEach(() => (resolver = new BaseResolver(registry)));
  afterEach(() => mockReset(registry) as unknown);

  describe("get dependencies()", () => {
    describe.each([Boolean, "dependency", Symbol("dependency")])(
      "when there is %p as dependency",
      (dependency) => {
        beforeEach(() => resolver.setDependencies([dependency]));
        it("should returns dependencies", () => {
          expect(resolver.dependencies).toEqual([dependency]);
        });
      },
    );
  });

  describe("get key()", () => {
    describe.each(["key", Symbol("key"), undefined])(
      "when there is %p as key",
      (key) => {
        beforeEach(() => resolver.setKey(key as ResolverKey));
        it("should returns key", () => {
          expect(resolver.key).toEqual(key);
        });
      },
    );
  });

  describe("get registry()", () => {
    it("should returns registry", () => {
      expect(resolver.registry).toBe(registry);
    });
  });

  describe("get scope()", () => {
    describe.each(["container", "request", "singleton", "transient"])(
      "when there is %p as scope",
      (scope) => {
        beforeEach(() => resolver.setScope(scope as ResolverScope));
        it(`should returns "${scope}"`, () => {
          expect(resolver.scope).toBe(scope);
        });
      },
    );
  });

  describe("get tags()", () => {
    describe.each(["tag", Symbol("tag")])("when there is %p as tag", (tag) => {
      beforeEach(() => resolver.setTags([tag]));
      it("should returns tags", () => {
        expect(resolver.tags).toEqual([tag]);
      });
    });
  });

  describe("resolve(scope, ...params)", () => {
    let scope: Scope;
    beforeEach(() => (scope = new Scope("container")));

    describe.each(["key", Symbol("key"), undefined])(
      "when there is %p as key",
      (key) => {
        beforeEach(() => resolver.setKey(key as ResolverKey));

        describe.each(["container", "request", "singleton", "transient"])(
          "and there is %p as scope",
          (resolverScope) => {
            beforeEach(() => resolver.setScope(resolverScope as ResolverScope));

            if (resolverScope === "singleton")
              beforeEach(() => scope.set(key as ResolverKey, true));

            if (typeof key !== "undefined" && resolverScope === "singleton")
              it("should returns instance", () => {
                const instance = resolver.resolve(scope);
                expect(instance).toBeTrue();
              });
            else
              it(`should throws error`, () => {
                expect(() => resolver.resolve(scope)).toThrow(ResolverError);
              });
          },
        );
      },
    );
  });

  describe("resetDependencies()", () => {
    describe.each([Boolean, "dependency", Symbol("dependency")])(
      "when there is %p as dependency",
      (dependency) => {
        beforeEach(() => resolver.setDependencies([dependency]));
        it("should returns self", () => {
          const self = resolver.resetDependencies();
          expect(self).toBe(resolver);
        });
      },
    );
  });

  describe("resetKey()", () => {
    describe.each(["key", Symbol("key"), undefined])(
      "when there is %p as key",
      (key) => {
        beforeEach(() => resolver.setKey(key as ResolverKey));
        it("should returns self", () => {
          const self = resolver.resetKey();
          expect(self).toBe(resolver);
        });
      },
    );
  });

  describe("resetScope()", () => {
    describe.each(["container", "request", "singleton", "transient"])(
      "when there is %p as scope",
      (scope) => {
        beforeEach(() => resolver.setScope(scope as ResolverScope));
        it(`should returns self`, () => {
          const self = resolver.resetScope();
          expect(self).toBe(resolver);
        });
      },
    );
  });

  describe("resetTags()", () => {
    describe.each(["tag", Symbol("tag")])("when there is %p as tag", (tag) => {
      beforeEach(() => resolver.setTags([tag]));
      it("should returns self", () => {
        const self = resolver.resetTags();
        expect(self).toBe(resolver);
      });
    });
  });

  describe.each([Boolean, "dependency", Symbol("dependency")])(
    "setDependencies([%p])",
    (dependency) => {
      it("should returns self", () => {
        const self = resolver.setDependencies([dependency]);
        expect(self).toBe(resolver);
      });
    },
  );

  describe.each(["key", Symbol("key"), undefined])("setKey(%p)", (key) => {
    it("should returns self", () => {
      const self = resolver.setKey(key as ResolverKey);
      expect(self).toBe(resolver);
    });
  });

  describe.each(["container", "request", "singleton", "transient"])(
    "setScope(%p)",
    (scope) => {
      it(`should returns self`, () => {
        const self = resolver.setScope(scope as ResolverScope);
        expect(self).toBe(resolver);
      });
    },
  );

  describe.each(["tag", Symbol("tag")])("setTags([%p])", (tag) => {
    it("should returns self", () => {
      const self = resolver.setTags([tag]);
      expect(self).toBe(resolver);
    });
  });
});
