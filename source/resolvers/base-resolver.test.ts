import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ResolverScope } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ResolverError } from "../errors/resolver-error.js";
import { BaseResolver } from "./base-resolver.js";

describe("new BaseResolver(registry)", () => {
  let mockRegistry: RegistryInterface;
  let resolver: BaseResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    resolver = new BaseResolver(mockRegistry);
  });
  afterEach(() => {
    mockReset(mockRegistry);
  });

  describe("getDependencies()", () => {
    describe("when there is dependencies", () => {
      beforeEach(() => resolver.setDependencies(["dependency"]));
      it("should return dependencies", () => {
        const dependencies = resolver.getDependencies();
        expect(dependencies).toEqual(["dependency"]);
      });
    });
    describe("when there is no dependencies", () => {
      it("should return empty dependencies", () => {
        const dependencies = resolver.getDependencies();
        expect(dependencies).toBeEmpty();
      });
    });
  });

  describe("getKey()", () => {
    describe("when there is key", () => {
      beforeEach(() => resolver.setKey("key"));
      it("should return key", () => {
        const key = resolver.getKey();
        expect(key).toBe("key");
      });
    });
    describe("when there is no key", () => {
      it("should return undefined", () => {
        const key = resolver.getKey();
        expect(key).toBeUndefined();
      });
    });
  });

  describe("getRegistry()", () => {
    it("should return registry", () => {
      const registry = resolver.getRegistry();
      expect(registry).toBe(mockRegistry);
    });
  });

  describe("getScope()", () => {
    describe.each(["container", "request", "singleton", "transient"])(
      "when there is scope(%p)",
      (testScope) => {
        beforeEach(() => resolver.setScope(testScope as ResolverScope));
        it(`should return "${testScope}"`, () => {
          const scope = resolver.getScope();
          expect(scope).toBe(testScope);
        });
      },
    );
    describe("when there is no scope", () => {
      it(`should return "transient"`, () => {
        const scope = resolver.getScope();
        expect(scope).toBe("transient");
      });
    });
  });

  describe("getTags()", () => {
    describe("when there is tags", () => {
      beforeEach(() => resolver.setTags(["tag"]));
      it("should return tags", () => {
        const tags = resolver.getTags();
        expect(tags).toEqual(["tag"]);
      });
    });
    describe("when there is no tags", () => {
      it("should return empty tags", () => {
        const tags = resolver.getTags();
        expect(tags).toBeEmpty();
      });
    });
  });

  describe("resolve(scope, ...params)", () => {
    let mockScope: MockProxy<ScopeInterface>;
    beforeEach(() => {
      mockScope = mock<ScopeInterface>();
      mockScope.fork.mockReturnThis();
    });
    afterEach(() => {
      mockReset(mockScope);
    });

    describe("when there is no key", () => {
      it("should throw error", () => {
        const invoke = () => resolver.resolve(mockScope);
        expect(invoke).toThrow(ResolverError);
      });
    });

    describe.each(["key", Symbol("key")])(
      "when there is key(%p)",
      (testKey) => {
        beforeEach(() => resolver.setKey(testKey));
        beforeEach(() => mockScope.walkTo.mockReturnThis());
        describe("and scope has record", () => {
          beforeEach(() => mockScope.hasRecord.mockReturnValue(true));
          beforeEach(() => mockScope.getRecord.mockReturnValue(new Date()));
          it("should return instance", () => {
            const instance = resolver.resolve<Date>(mockScope);
            expect(instance).toBeInstanceOf(Date);
          });
        });
        describe("and scope has no record", () => {
          beforeEach(() => mockScope.hasRecord.mockReturnValue(false));
          it("should throw error", () => {
            const invoke = () => resolver.resolve(mockScope);
            expect(invoke).toThrowError(ResolverError);
          });
        });
      },
    );
  });

  describe("resetDependencies()", () => {
    describe("when there is dependencies", () => {
      beforeEach(() => resolver.setDependencies(["dependency"]));
      it("should return self", () => {
        const self = resolver.resetDependencies();
        expect(self).toBe(resolver);
      });
    });
    describe("when there is no dependencies", () => {
      it("should return self", () => {
        const self = resolver.resetDependencies();
        expect(self).toBe(resolver);
      });
    });
  });

  describe("resetKey()", () => {
    describe("when there is key", () => {
      beforeEach(() => resolver.setKey("key"));
      it("should return self", () => {
        const self = resolver.resetKey();
        expect(self).toBe(resolver);
      });
    });
    describe("when there is no key", () => {
      it("should return self", () => {
        const self = resolver.resetKey();
        expect(self).toBe(resolver);
      });
    });
  });

  describe("resetScope()", () => {
    describe.each(["container", "request", "singleton", "transient"])(
      "when there scope(%p)",
      (testScope) => {
        beforeEach(() => resolver.setScope(testScope as ResolverScope));
        it("should return self", () => {
          const self = resolver.resetScope();
          expect(self).toBe(resolver);
        });
      },
    );
    describe("when there is no scope", () => {
      it("should return self", () => {
        const self = resolver.resetScope();
        expect(self).toBe(resolver);
      });
    });
  });

  describe("resetTags()", () => {
    describe("when there is tags", () => {
      beforeEach(() => resolver.setTags(["tag"]));
      it("should return self", () => {
        const self = resolver.resetTags();
        expect(self).toBe(resolver);
      });
    });
    describe("when there is no tags", () => {
      it("should return self", () => {
        const self = resolver.resetTags();
        expect(self).toBe(resolver);
      });
    });
  });
});
