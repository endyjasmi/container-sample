import {
  ScopeEntries,
  ScopeEntry,
  ScopeInterface,
  ScopeKey,
  ScopeKeys,
  ScopeRecord,
} from "./contracts/scope.contract.js";

export class Scope<ScopeValue> implements ScopeInterface<ScopeValue> {
  protected _parent?: Scope<ScopeValue>;
  protected _record: ScopeRecord<ScopeValue | undefined> = {};

  public constructor(parent?: Scope<ScopeValue>) {
    this._parent = parent;
  }

  public get parent(): this | undefined {
    return this._parent as this | undefined;
  }

  public get record(): ScopeRecord<ScopeValue> {
    const toObject = (
      record: ScopeRecord<ScopeValue>,
      [key, value]: ScopeEntry<ScopeValue>,
    ) => Object.assign(record, { [key]: value });
    return this.entries().reduce(toObject, {});
  }

  public clear(key: ScopeKey): this {
    if (typeof this._parent === "undefined") delete this._record[key];
    else this._record[key] = undefined;
    return this;
  }

  public entries(): ScopeEntries<ScopeValue> {
    const byDefinedValue = ([, value]: ScopeEntry<ScopeValue | undefined>) =>
      typeof value !== "undefined";
    return Object.entries(this._flattenRecord()).filter(
      byDefinedValue,
    ) as ScopeEntries<ScopeValue>;
  }

  public fork(): this {
    const Static = this.constructor as typeof Scope;
    return new Static(this) as this;
  }

  public get(key: ScopeKey): ScopeValue | undefined {
    if (key in this._record) return this._record[key];
    return typeof this._parent !== "undefined"
      ? this._parent.get(key)
      : undefined;
  }

  public has(key: ScopeKey): boolean {
    if (key in this._record) return typeof this._record[key] !== "undefined";
    return typeof this._parent !== "undefined" ? this._parent.has(key) : false;
  }

  public keys(): ScopeKeys {
    const toKey = ([key]: ScopeEntry<ScopeValue>) => key;
    return this.entries().map(toKey);
  }

  public set(key: ScopeKey, value: ScopeValue): this {
    this._record[key] = value;
    return this;
  }

  public values(): Array<ScopeValue> {
    const toValue = ([, value]: ScopeEntry<ScopeValue>) => value;
    return this.entries().map(toValue);
  }

  protected _flattenRecord(): ScopeRecord<ScopeValue | undefined> {
    return typeof this._parent !== "undefined"
      ? Object.assign(this._parent._flattenRecord(), this._record)
      : Object.assign({}, this._record);
  }
}
