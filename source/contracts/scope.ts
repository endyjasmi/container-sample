export interface ScopeInterface {
  readonly parent?: this;
  readonly type: ScopeType;
  clear(key: ScopeKey): this;
  fork(type: ScopeType): this;
  get(key: ScopeKey): unknown;
  has(key: ScopeKey): boolean;
  set(key: ScopeKey, value: unknown): this;
}

export type ScopeConstructor = {
  (type: ScopeType): ScopeInterface;
  (type: ScopeType, parent: ScopeInterface): ScopeInterface;
};

export type ScopeKey = string | symbol;

export type ScopeType = "container" | "request";
