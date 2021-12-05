export const ScopeContract = Symbol("Scope");

export interface ScopeInterface<ScopeValue> {
  parent: this | undefined;
  record: ScopeRecord<ScopeValue>;

  clear(key: ScopeKey): this;
  entries(): ScopeEntries<ScopeValue>;
  fork(): this;
  get(key: ScopeKey): ScopeValue | undefined;
  has(key: ScopeKey): boolean;
  keys(): ScopeKeys;
  set(key: ScopeKey, value: ScopeValue): this;
  values(): Array<ScopeValue>;
}

export type ScopeEntries<ScopeValue> = Array<ScopeEntry<ScopeValue>>;

export type ScopeEntry<ScopeValue> = [ScopeKey, ScopeValue];

export type ScopeKey = string | symbol;

export type ScopeKeys = Array<ScopeKey>;

export type ScopeRecord<ScopeValue> = Record<ScopeKey, ScopeValue>;
