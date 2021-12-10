import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { ResolverInterface } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ResolverError } from "../errors/resolver-error.js";
import { AliasResolver } from "./alias-resolver.js";

describe("new AliasResolver(registry, alias)", () => {
  let mockRegistry: MockProxy<RegistryInterface>;
  let mockResolver: MockProxy<ResolverInterface>;
  let mockScope: MockProxy<ScopeInterface>;
  let resolver: AliasResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    mockResolver = mock<ResolverInterface>();
    mockScope = mock<ScopeInterface>();
    resolver = new AliasResolver(mockRegistry, "alias");
  });
  afterEach(() => {
    mockReset(mockRegistry);
    mockReset(mockResolver);
    mockReset(mockScope);
  });

  describe("resolve(scope, ...params)", () => {
    describe("when there is alias resolver", () => {
      beforeEach(() => mockRegistry.findByKey.mockReturnValue(mockResolver));
      beforeEach(() => mockResolver.resolve.mockReturnValue(new Date()));
      it("should return instance", () => {
        const instance = resolver.resolve<Date>(mockScope);
        expect(instance).toBeInstanceOf(Date);
      });
    });
    describe("when there is no alias resolver", () => {
      beforeEach(() => mockRegistry.findByKey.mockReturnValue(undefined));
      it("should throw error", () => {
        const invoke = () => resolver.resolve<Date>(mockScope);
        expect(invoke).toThrowError(ResolverError);
      });
    });
  });
});
