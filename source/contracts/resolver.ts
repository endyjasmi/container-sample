import { BinderInterface } from "./binder.js";
import { BindingInterface, BindingKey, BindingTag } from "./binding.js";
import { Callable } from "./callable.js";
import { ScopeInterface } from "./scope.js";

export interface ResolverInterface {
  readonly binder?: BinderInterface;
  readonly binding?: BindingInterface;
  resolve<Instance>(scope: ScopeInterface, ...params: unknown[]): Instance;
  setBinding(binding: BindingInterface): this;
}

export type AliasResolverConstructor = (alias: BindingKey) => ResolverInterface;

export type CallableResolverConstructor = (
  callable: Callable,
) => ResolverInterface;

export type ClassResolverConstructor = (
  constructor: Function,
) => ResolverInterface;

export type ConstantResolverConstructor = (
  constant: unknown,
) => ResolverInterface;

export type TagResolverConstructor = (tag: BindingTag) => ResolverInterface;
