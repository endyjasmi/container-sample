import {
  BindingConstructor,
  BindingInterface,
  BindingKey,
  BindingTag,
} from "./binding.js";
import { ResolverInterface } from "./resolver.js";

export interface BinderInterface {
  readonly bindings: Array<BindingInterface>;
  readonly factory: BinderFactory;
  bind(key: BindingKey, resolver: ResolverInterface): BindingInterface;
  bound(key: BindingKey): boolean;
  deindexKey(key: BindingKey, binding: BindingInterface): this;
  deindexTag(tag: BindingTag, binding: BindingInterface): this;
  findByKey(key: BindingKey): BindingInterface;
  findByTag(tag: BindingTag): Array<BindingInterface>;
  indexKey(key: BindingKey, binding: BindingInterface): this;
  indexTag(tag: BindingTag, binding: BindingInterface): this;
  unbind(key: BindingKey): BindingInterface;
}

export type BinderConstructor = (factory: BinderFactory) => BinderInterface;

export type BinderFactory = {
  createBinding: BindingConstructor;
};
