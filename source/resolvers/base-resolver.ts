import { RegistryInterface } from "../contracts/registry.js";
import {
  ResolverDependencies,
  ResolverInterface,
  ResolverKey,
  ResolverScope,
  ResolverTags,
} from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { ResolverError } from "../errors/resolver-error.js";

export class BaseResolver implements ResolverInterface {
  protected _dependencies: ResolverDependencies = [];

  protected _key?: ResolverKey;

  protected _registry: RegistryInterface;

  protected _scope: ResolverScope = "transient";

  protected _tags: ResolverTags = [];

  public constructor(registry: RegistryInterface) {
    this._registry = registry;
  }

  public get dependencies(): ResolverDependencies {
    return this._dependencies;
  }

  public get key(): ResolverKey | undefined {
    return this._key;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get scope(): ResolverScope {
    return this._scope;
  }

  public get tags(): ResolverTags {
    return this._tags;
  }

  public resetDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public resetKey(): this {
    if (typeof this._key === "undefined") return this;
    this._registry.deindexKey(this._key, this);
    delete this._key;
    return this;
  }

  public resetScope(): this {
    this._scope = "transient";
    return this;
  }

  public resetTags(): this {
    if (this._tags.length < 1) return this;
    this._tags.forEach((tag) => this._registry.deindexTag(tag, this));
    this._tags = [];
    return this;
  }

  public resolve<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    const currentScope = scope.fork("request");
    if (typeof this._key === "undefined")
      return this._resolveRaw(currentScope, ...params);

    const activeScope = currentScope.to(this._scope);
    if (activeScope.has(this._key))
      return activeScope.get(this._key) as Instance;
    return activeScope
      .set(this._key, this._resolveRaw(scope, ...params))
      .get(this._key) as Instance;
  }

  public setDependencies(dependencies: ResolverDependencies): this {
    this._dependencies = dependencies;
    return this;
  }

  public setKey(key: ResolverKey): this {
    this.resetKey();
    this._key = key;
    this._registry.indexKey(this._key, this);
    return this;
  }

  public setScope(scope: ResolverScope): this {
    this._scope = scope;
    return this;
  }

  public setTags(tags: ResolverTags): this {
    this.resetTags();
    this._tags = tags;
    this._tags.forEach((tag) => this._registry.indexTag(tag, this));
    return this;
  }

  protected _resolveRaw<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    const resolverKey =
      typeof this._key !== "undefined"
        ? typeof this._key !== "string"
          ? this._key.toString()
          : this._key
        : "undefined";
    const context = `Resolving '${resolverKey}'.`;
    const problem = `Failed to resolve.`;
    const solution = "Method not implemented.";
    throw new ResolverError(`${context} ${problem} ${solution}.`);
  }
}
