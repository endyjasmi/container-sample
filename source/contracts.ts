export interface Binder {
  readonly factory: BindingFactory;
  clear(key: BindingKey): this;
  get(key: BindingKey): Binding;
  has(key: BindingKey): boolean;
  query(tag: BindingTag): Bindings;
  set(key: BindingKey, binding: Binding): this;
  tag(tag: BindingTag, binding: Binding): this;
  untag(tag: BindingTag, binding: Binding): this;
}
export type BinderConstructor = {
  (factory: BindingFactory): Binder;
};

export interface Binding {
  readonly binder: Binder;
  readonly key: BindingKey;
  readonly resolver: Resolver;
  readonly scope: BindingScope;
  readonly tags: BindingTags;
  at(scope: BindingScope): this;
  resolve<Instance>(scope: Scope, ...params: unknown[]): Instance;
  setKey(key: BindingKey): this;
  setTags(tags: BindingTags): this;
}
export type BindingConstructor = {
  (binder: Binder, key: BindingKey, resolver: Resolver): Binding;
};
export type BindingFactory = {
  create(binder: Binder, key: BindingKey, resolver: Resolver): Binding;
};
export type BindingKey = string | symbol;
export type BindingScope = "container" | "request" | "singleton" | "transient";
export type BindingTag = string | symbol;
export type BindingTags = Array<BindingTag>;
export type Bindings = Array<Binding>;

export interface Container {
  readonly binder: Binder;
  readonly parent?: this;
  readonly scope: Scope;
  bind(bindable: Bindable): Binder;
  fork(): this;
  resolve<Instance>(resolvable: Resolvable, ...params: unknown[]): Instance;
}
export type Bindable = Function | string | symbol;
export type ContainerConstructor = {
  (binder: Binder, scope: Scope, parent?: Container): Container;
};
export type Resolvable = Function | string | symbol;

export interface Resolver {
  readonly binder: Binder;
  readonly binding: Binding;
  resolve<Instance>(scope: Scope, ...params: unknown[]): Instance;
}
export type ResolverConstructor = {
  (binding: Binding): Resolver;
};

export interface Scope {
  readonly parent?: this;
  readonly type: ScopeType;
  clear(key: ScopeKey): this;
  fork(): this;
  fork(type: ScopeType): this;
  get(key: ScopeKey): unknown;
  has(key: ScopeKey): boolean;
  set(key: ScopeKey, value: unknown): this;
}
export type ScopeConstructor = {
  (): Scope;
  (parent: Scope): Scope;
  (parent: Scope, type: ScopeType): Scope;
};
export type ScopeKey = string | symbol;
export type ScopeType = "container" | "request";
