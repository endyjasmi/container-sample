import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ResolverInterface } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ResolverError } from "../errors/resolver-error.js";
import { TagResolver } from "./tag-resolver.js";

describe("new TagResolver(registry, tag)", () => {
  let mockRegistry: MockProxy<RegistryInterface>;
  let mockResolver: MockProxy<ResolverInterface>;
  let mockScope: MockProxy<ScopeInterface>;
  let resolver: TagResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    mockResolver = mock<ResolverInterface>();
    mockScope = mock<ScopeInterface>();
    resolver = new TagResolver(mockRegistry, "tag");
  });
  afterEach(() => {
    mockReset(mockRegistry);
    mockReset(mockResolver);
    mockReset(mockScope);
  });

  describe("resolve(scope, ...params)", () => {
    describe("when there is tag resolver", () => {
      beforeEach(() => mockRegistry.findByTag.mockReturnValue(mockResolver));
      beforeEach(() => mockResolver.resolve.mockReturnValue(new Date()));
      it("should return instance", () => {
        const instance = resolver.resolve<Date>(mockScope);
        expect(instance).toBeInstanceOf(Date);
      });
    });
  });
  describe("when there is no tag resolver", () => {
    beforeEach(() => mockRegistry.findByTag.mockReturnValue(undefined));
    it("should return instance", () => {
      const invoke = () => resolver.resolve<Date>(mockScope);
      expect(invoke).toThrowError(ResolverError);
    });
  });
});
