import {
  AliasResolverConstructor,
  Callable,
  CallableResolverConstructor,
  ClassResolverConstructor,
  ConstantResolverConstructor,
  Resolvable,
  ResolverInterface,
  ResolverKey,
  ResolverTag,
  TagResolverConstructor,
} from "./resolver.js";
import { ScopeInterface } from "./scope.js";

export interface RegistryInterface {
  createAliasResolver(alias: ResolverKey): ResolverInterface;
  createCallableResolver(callable: Callable): ResolverInterface;
  createClassResolver(constructor: Function): ResolverInterface;
  createConstantResolver(constant: unknown): ResolverInterface;
  createTagResolver(tag: ResolverTag): ResolverInterface;
  deindexKey(key: ResolverKey, resolver: ResolverInterface): this;
  deindexTag(tag: ResolverTag, resolver: ResolverInterface): this;
  findByKey(key: ResolverKey): ResolverInterface | undefined;
  findByTag(tag: ResolverTag): ResolverInterface | undefined;
  indexKey(key: ResolverKey, resolver: ResolverInterface): this;
  indexTag(tag: ResolverTag, resolver: ResolverInterface): this;
  resolve<Instance>(
    resolvable: Resolvable,
    scope: ScopeInterface,
    ...params: unknown[]
  ): Instance;
}

export type RegistryConstruct = {
  (factory: RegistryFactory): RegistryInterface;
};

export type RegistryFactory = {
  createAliasResolver: AliasResolverConstructor;
  createCallableResolver: CallableResolverConstructor;
  createClassResolver: ClassResolverConstructor;
  createConstantResolver: ConstantResolverConstructor;
  createTagResolver: TagResolverConstructor;
};
