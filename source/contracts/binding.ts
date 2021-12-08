import { BinderInterface } from "./binder.js";
import { ResolverInterface } from "./resolver.js";
import { ScopeInterface } from "./scope.js";

export interface BindingInterface {
  readonly binder: BinderInterface;
  readonly bound: boolean;
  readonly dependencies: BindingDependencies;
  readonly key?: BindingKey;
  readonly resolver: ResolverInterface;
  readonly scope: BindingScope;
  readonly tags: BindingTags;
  bindTo(key: BindingKey): this;
  resolve<Instance>(scope: ScopeInterface, ...params: unknown[]): Instance;
  setDepedendencies(dependencies: BindingDependencies): this;
  setScope(scope: BindingScope): this;
  setTags(tags: BindingTags): this;
  unbind(): this;
}

export type BindingConstructor = (
  binder: BinderInterface,
  resolver: ResolverInterface,
) => BindingInterface;

export type BindingDependencies = Array<BindingDependency>;

export type BindingDependency = BindingKey | Function;

export type BindingKey = string | symbol;

export type BindingScope = "container" | "request" | "singleton" | "transient";

export type BindingTag = string | symbol;

export type BindingTags = Array<BindingTag>;
