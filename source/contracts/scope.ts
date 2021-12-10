export interface ScopeInterface {
  clearRecord(key: ScopeKey): this;
  fork(type: ScopeType): this;
  getParent(): this | undefined;
  getRecord(key: ScopeKey): unknown;
  getType(): ScopeType;
  hasRecord(key: ScopeKey): boolean;
  setRecord(key: ScopeKey, value: unknown): this;
  walkTo(walkType: WalkType): this;
}

export type ScopeConstructor = {
  (type: ScopeType): ScopeInterface;
  (type: ScopeType, parent: ScopeInterface): ScopeInterface;
};

export type ScopeKey = string | symbol;

export type ScopeType = "container" | "request";

export type WalkType = "container" | "request" | "singleton" | "transient";
