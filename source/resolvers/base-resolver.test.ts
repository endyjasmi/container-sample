import { mock, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ResolverKey, ResolverScope } from "../contracts/resolver.js";
import { ResolverError } from "../errors/resolver-error.js";
import { Scope } from "../scope.js";
import { BaseResolver } from "./base-resolver.js";

describe("BaseResolver", () => {
  let mockRegistry: RegistryInterface;
  let resolver: BaseResolver;
  beforeEach(() => (mockRegistry = mock<RegistryInterface>()));
  beforeEach(() => (resolver = new BaseResolver(mockRegistry)));
  afterEach(() => mockReset(mockRegistry) as unknown);

  describe("getDependencies()", () => {
    describe.each([Boolean, "dependency", Symbol("dependency")])(
      "when there is %p as dependency",
      (dependency) => {
        beforeEach(() => resolver.setDependencies([dependency]));
        it("should returns dependencies", () => {
          const dependencies = resolver.getDependencies();
          expect(dependencies).toEqual([dependency]);
        });
      },
    );
  });

  describe("getKey()", () => {
    describe.each(["key", Symbol("key"), undefined])(
      "when there is %p as key",
      (resolverKey) => {
        beforeEach(() => resolver.setKey(resolverKey as ResolverKey));
        it("should returns key", () => {
          const key = resolver.getKey();
          expect(key).toEqual(resolverKey);
        });
      },
    );
  });

  describe("getRegistry()", () => {
    it("should returns registry", () => {
      const registry = resolver.getRegistry();
      expect(registry).toBe(mockRegistry);
    });
  });

  describe("getScope()", () => {
    describe.each(["container", "request", "singleton", "transient"])(
      "when there is %p as scope",
      (resolverScope) => {
        beforeEach(() => resolver.setScope(resolverScope as ResolverScope));
        it(`should returns "${resolverScope}"`, () => {
          const scope = resolver.getScope();
          expect(scope).toBe(resolverScope);
        });
      },
    );
  });

  describe("getTags()", () => {
    describe.each(["tag", Symbol("tag")])(
      "when there is %p as tag",
      (resolverTag) => {
        beforeEach(() => resolver.setTags([resolverTag]));
        it("should returns tags", () => {
          const tags = resolver.getTags();
          expect(tags).toEqual([resolverTag]);
        });
      },
    );
  });

  describe("resolve(scope, ...params)", () => {
    let scope: Scope;
    beforeEach(() => (scope = new Scope("container")));

    describe.each(["key", Symbol("key"), undefined])(
      "when there is %p as key",
      (resolverKey) => {
        beforeEach(() => resolver.setKey(resolverKey as ResolverKey));

        describe.each(["container", "request", "singleton", "transient"])(
          "and there is %p as scope",
          (resolverScope) => {
            beforeEach(() => resolver.setScope(resolverScope as ResolverScope));

            if (resolverScope === "singleton")
              beforeEach(() =>
                scope.setRecord(resolverKey as ResolverKey, true),
              );

            if (
              typeof resolverKey !== "undefined" &&
              resolverScope === "singleton"
            )
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
