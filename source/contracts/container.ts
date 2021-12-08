import { BinderInterface } from "./binder.js";
import { BindingInterface, BindingKey, BindingTag } from "./binding.js";
import { Callable } from "./callable.js";
import {
  AliasResolverConstructor,
  CallableResolverConstructor,
  ClassResolverConstructor,
  ConstantResolverConstructor,
  TagResolverConstructor,
} from "./resolver.js";
import { ScopeConstructor, ScopeInterface } from "./scope.js";

export interface ContainerInterface {
  readonly binder: BinderInterface;
  readonly factory: ContainerFactory;
  readonly parent?: this;
  readonly scope: ScopeInterface;
  bind(key: BindingKey): BindInterface;
  bound(key: BindingKey): boolean;
  fork(): this;
  call<Result>(callable: Callable, ...params: unknown[]): Result;
  resolve<Instance>(resolvable: Resolvable, ...params: unknown[]): Instance;
  unbind(key: BindingKey): BindingInterface;
}

export type BindInterface = {
  to(constructor: Function): BindingInterface;
  toAlias(alias: BindingKey): BindingInterface;
  toCallable(callable: Callable): BindingInterface;
  toConstant(constant: unknown): BindingInterface;
  toTag(tag: BindingTag): BindingInterface;
};

export type ContainerConstructor = {
  (factory: ContainerFactory): ContainerConstructor;
  (parent: ContainerConstructor): ContainerConstructor;
};

export type ContainerFactory = {
  createAliasResolver: AliasResolverConstructor;
  createCallableResolver: CallableResolverConstructor;
  createClassResolver: ClassResolverConstructor;
  createConstantResolver: ConstantResolverConstructor;
  createScope: ScopeConstructor;
  createTagResolver: TagResolverConstructor;
};

export type Resolvable = BindingKey | Function;
