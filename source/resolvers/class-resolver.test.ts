import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ClassResolver } from "./class-resolver.js";

describe("new ClassResolver(registry, constructor)", () => {
  let mockRegistry: MockProxy<RegistryInterface>;
  let mockScope: MockProxy<ScopeInterface>;
  let resolver: ClassResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    mockScope = mock<ScopeInterface>();
    resolver = new ClassResolver(mockRegistry, Date);
  });
  afterEach(() => {
    mockReset(mockRegistry);
    mockReset(mockScope);
  });

  describe("resolve(scope, ...params)", () => {
    describe("when there is dependencies", () => {
      beforeEach(() => resolver.setDependencies(["date"]));
      beforeEach(() => mockRegistry.resolve.mockReturnValue("2021-12-10"));
      it("should return instance", () => {
        const instance = resolver.resolve<Date>(mockScope);
        expect(instance).toBeInstanceOf(Date);
      });
    });
    describe("when there is params", () => {
      it("should return instance", () => {
        const instance = resolver.resolve<Date>(mockScope, "2021-12-10");
        expect(instance).toBeInstanceOf(Date);
      });
    });
  });
});
