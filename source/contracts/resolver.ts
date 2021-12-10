import { RegistryInterface } from "./registry.js";
import { ScopeInterface } from "./scope.js";

export interface ResolverInterface {
  getDependencies(): ResolverDependencies;
  getKey(): ResolverKey | undefined;
  getRegistry(): RegistryInterface;
  getScope(): ResolverScope;
  getTags(): ResolverTags;
  resetDependencies(): this;
  resetKey(): this;
  resetScope(): this;
  resetTags(): this;
  resolve<Instance>(scope: ScopeInterface, ...params: unknown[]): Instance;
  setDependencies(dependencies: ResolverDependencies): this;
  setKey(key: ResolverKey): this;
  setScope(scope: ResolverScope): this;
  setTags(tags: ResolverTags): this;
}

export type Callable =
  | [Object, CallableProperty]
  | [Resolvable, CallableProperty]
  | Function
  | string;

export type CallableProperty = string | symbol;

export type Resolvable = Function | ResolverKey;

export type ResolverDependencies = Array<Resolvable>;

export type ResolverKey = string | symbol;

export type ResolverScope = "container" | "request" | "singleton" | "transient";

export type ResolverTag = string | symbol;

export type ResolverTags = Array<ResolverTag>;

// Specific resolver constructors
export type AliasResolverConstructor = {
  (registry: RegistryInterface, alias: ResolverKey): ResolverInterface;
};

export type CallableResolverConstructor = {
  (registry: RegistryInterface, callable: CallableProperty): ResolverInterface;
};

export type ClassResolverConstructor = {
  (registry: RegistryInterface, constructor: Function): ResolverInterface;
};

export type ConstantResolverConstructor = {
  (registry: RegistryInterface, constant: unknown): ResolverInterface;
};

export type TagResolverConstructor = {
  (registry: RegistryInterface, tag: ResolverTag): ResolverInterface;
};
