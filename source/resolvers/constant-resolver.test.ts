import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ConstantResolver } from "./constant-resolver.js";

describe("new ConstantResolver(registry, constant)", () => {
  let mockRegistry: MockProxy<RegistryInterface>;
  let mockScope: MockProxy<ScopeInterface>;
  let resolver: ConstantResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    mockScope = mock<ScopeInterface>();
    resolver = new ConstantResolver(mockRegistry, new Date());
  });
  afterEach(() => {
    mockReset(mockRegistry);
    mockReset(mockScope);
  });

  describe("resolve(scope, ...params)", () => {
    it("should return instance", () => {
      const instance = resolver.resolve<Date>(mockScope);
      expect(instance).toBeInstanceOf(Date);
    });
  });
});
