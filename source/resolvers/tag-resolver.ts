import { RegistryInterface } from "../contracts/registry.js";
import { ResolverTag } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class TagResolver extends BaseResolver {
  protected _tag: ResolverTag;

  public constructor(registry: RegistryInterface, tag: ResolverTag) {
    super(registry);
    this._tag = tag;
  }

  public _resolveRaw<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    const resolver = this._registry.findByTag(this._tag);
    if (typeof resolver === "undefined") {
      const problem = `Resolver not found.`;
      const solution = `Please use another tag.`;
      throw this._createError(problem, solution);
    }
    return resolver.resolve(scope, ...params);
  }
}
