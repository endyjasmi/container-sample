import { RegistryInterface } from "../contracts/registry.js";
import { Callable, Instance, Method } from "../contracts/resolver.js";
import { ScopeInterface } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class CallableResolver extends BaseResolver {
  protected _callable: Callable;

  public constructor(registry: RegistryInterface, callable: Callable) {
    super(registry);
    this._callable = callable;
  }

  public _resolveRaw<Result>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Result {
    if (Array.isArray(this._callable)) {
      const instance =
        typeof this._callable[0] !== "object"
          ? this._registry.resolve<Instance<Result>>(this._callable[0], scope)
          : (this._callable[0] as Instance<Result>);
      const target = instance[this._callable[1]].bind(instance);
      const targetArgs = this._dependencies
        .map((dependency) => this._registry.resolve(dependency, scope))
        .concat(...params);
      return target(...targetArgs);
    } else if (typeof this._callable === "function") {
      const target = this._callable as Method<Result>;
      const targetArgs = this._dependencies
        .map((dependency) => this._registry.resolve(dependency, scope))
        .concat(...params);
      return target(...targetArgs);
    } else {
      if (!this._callable.match(/^[0-9a-z]+#[0-9a-z]+$/i)) {
        const problem = `Failed to parse callable pattern.`;
        const solution = `Please use following pattern '{instanceKey}#{method}'.`;
        throw this._createError(problem, solution);
      }

      const [instanceKey, methodName] = this._callable.split("#");
      const instance = this._registry.resolve<Instance<Result>>(
        instanceKey,
        scope,
      );

      const target = instance[methodName].bind(instance);
      const targetArgs = this._dependencies
        .map((dependency) => this._registry.resolve(dependency, scope))
        .concat(...params);
      return target(...targetArgs);
    }
  }
}
