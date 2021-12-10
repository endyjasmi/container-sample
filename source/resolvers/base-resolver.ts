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

  public getDependencies(): ResolverDependencies {
    return this._dependencies;
  }

  public getKey(): ResolverKey | undefined {
    return this._key;
  }

  public getRegistry(): RegistryInterface {
    return this._registry;
  }

  public getScope(): ResolverScope {
    return this._scope;
  }

  public getTags(): ResolverTags {
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

    const activeScope = currentScope.walkTo(this._scope);
    if (activeScope.hasRecord(this._key))
      return activeScope.getRecord(this._key) as Instance;
    return activeScope
      .setRecord(this._key, this._resolveRaw(scope, ...params))
      .getRecord(this._key) as Instance;
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

  protected _createError(problem: string, solution: string): void {
    const context =
      typeof this._key !== "undefined"
        ? typeof this._key !== "string"
          ? `Resolving '${this._key.toString()}' record.`
          : `Resolving '${this._key}' record.`
        : `Resolving keyless record.`;
    throw new ResolverError(`${context} ${problem} ${solution}`);
  }

  protected _resolveRaw<Instance>(
    scope: ScopeInterface /* eslint-disable-line */,
    ...params: unknown[] /* eslint-disable-line */
  ): Instance {
    const problem = `Method not implemented.`;
    const solution = `Please implement the method before invoke.`;
    throw this._createError(problem, solution);
  }
}
