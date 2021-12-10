import { RegistryInterface } from "./registry.js";
import {
  Callable,
  Resolvable,
  ResolverInterface,
  ResolverKey,
  ResolverTag,
} from "./resolver.js";
import { ScopeInterface } from "./scope.js";

export interface ContainerInterface {
  bind(key: ResolverKey): ContainerBindSyntax;
  call<Result>(callable: Callable, ...params: unknown[]): Result;
  factory<Instance>(resolvable: Resolvable): ContainerFactory<Instance>;
  fork(): this;
  getParent(): this | undefined;
  getRegistry(): RegistryInterface;
  getScope(): ScopeInterface;
  resolve<Instance>(resolvable: Resolvable, ...params: unknown[]): Instance;
}

export type ContainerBindSyntax = {
  to(constructor: Function): ResolverInterface;
  toAlias(alias: ResolverKey): ResolverInterface;
  toCallable(callable: Callable): ResolverInterface;
  toConstant(constant: unknown): ResolverInterface;
  toTag(tag: ResolverTag): ResolverInterface;
};

export type ContainerConstructor = {
  (registry: RegistryInterface, scope: ScopeInterface): ContainerInterface;
  (parent: ContainerInterface): ContainerInterface;
};

export type ContainerFactory<Instance> = (...params: unknown[]) => Instance;
