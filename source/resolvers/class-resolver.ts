import { RegistryInterface } from "../contracts/registry.js";
import { ScopeInterface } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class ClassResolver extends BaseResolver {
  protected _constructor: Function;

  public constructor(registry: RegistryInterface, constructor: Function) {
    super(registry);
    this._constructor = constructor;
  }

  public _resolveRaw<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    const target = this._constructor as new (...args: unknown[]) => Instance;
    const targetArgs = this._dependencies
      .map((dependency) => this._registry.resolve(dependency, scope))
      .concat(...params);
    return new target(...targetArgs);
  }
}
