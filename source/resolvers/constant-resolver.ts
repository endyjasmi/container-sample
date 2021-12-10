/* eslint-disable @typescript-eslint/no-unused-vars */
import { RegistryInterface } from "../contracts/registry.js";
import { ScopeInterface } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class ConstantResolver extends BaseResolver {
  protected _constant: unknown;

  public constructor(registry: RegistryInterface, constant: unknown) {
    super(registry);
    this._constant = constant;
  }

  protected _resolveRaw<Instance>(
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance {
    return this._constant as Instance;
  }
}
