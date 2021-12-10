import { mock, MockProxy, mockReset } from "jest-mock-extended";
import { RegistryInterface } from "../contracts/registry.js";
import { Callable } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ResolverError } from "../errors/resolver-error.js";
import { CallableResolver } from "./callable-resolver.js";

describe.each([
  [[new Date(), "getTime"]],
  [[Date, "getTime"]],
  [["date", "getTime"]],
  [() => Date.now()],
  ["date#getTime"],
  ["date"],
])("new CallableResolver(registry, %p)", (testCallable) => {
  let mockRegistry: MockProxy<RegistryInterface>;
  let mockScope: MockProxy<ScopeInterface>;
  let resolver: CallableResolver;
  beforeEach(() => {
    mockRegistry = mock<RegistryInterface>();
    mockScope = mock<ScopeInterface>();
    resolver = new CallableResolver(mockRegistry, testCallable as Callable);
  });
  afterEach(() => {
    mockReset(mockRegistry);
    mockReset(mockScope);
  });

  describe("resolve(scope, ...params)", () => {
    beforeEach(() => mockScope.fork.mockReturnThis());
    beforeEach(() => mockRegistry.resolve.mockReturnValue(new Date()));
    if (testCallable !== "date")
      describe("when there is dependencies", () => {
        beforeEach(() => resolver.setDependencies(["date"]));
        it("should return instance", () => {
          const instance = resolver.resolve<number>(mockScope);
          expect(instance).toBeNumber();
        });
      });
    if (testCallable !== "date")
      describe("when there is no dependencies", () => {
        it("should return instance", () => {
          const instance = resolver.resolve<number>(mockScope);
          expect(instance).toBeNumber();
        });
      });
    if (testCallable === "date")
      it("should throw error", () => {
        const invoke = () => resolver.resolve<number>(mockScope);
        expect(invoke).toThrowError(ResolverError);
      });
  });
});
