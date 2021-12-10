import { RegistryInterface } from "../contracts/registry.js";
import { ResolverKey } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class AliasResolver extends BaseResolver {
  protected _alias: ResolverKey;

  public constructor(registry: RegistryInterface, alias: ResolverKey) {
    super(registry);
    this._alias = alias;
  }

  public _resolveRaw<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    const resolver = this._registry.findByKey(this._alias);
    if (typeof resolver === "undefined") {
      const problem = `Resolver not found.`;
      const solution = `Please use another alias.`;
      throw this._createError(problem, solution);
    }
    return resolver.resolve(scope, ...params);
  }
}
