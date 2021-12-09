import {
  ScopeInterface,
  ScopeKey,
  ScopeTo,
  ScopeType,
} from "./contracts/scope.js";

export class Scope implements ScopeInterface {
  protected _parent?: this;

  protected _record: Record<ScopeKey, unknown> = {};

  protected _type: ScopeType;

  public constructor(type: ScopeType, parent?: Scope) {
    this._parent = parent as this;
    this._type = type;
  }

  public get parent(): this | undefined {
    return this._parent;
  }

  public get type(): ScopeType {
    return this._type;
  }

  public clear(key: ScopeKey): this {
    if (typeof this._parent !== "undefined") this._record[key] = undefined;
    else delete this._record[key];
    return this;
  }

  public fork(type: ScopeType): this {
    const Static = this.constructor as typeof Scope;
    return new Static(type, this) as this;
  }

  public get(key: ScopeKey): unknown {
    if (key in this._record) return this._record[key];
    return typeof this._parent !== "undefined"
      ? this._parent.get(key)
      : undefined;
  }

  public has(key: ScopeKey): boolean {
    if (key in this._record) return typeof this._record[key] !== "undefined";
    return typeof this._parent !== "undefined" ? this._parent.has(key) : false;
  }

  public set(key: ScopeKey, value: unknown): this {
    this._record[key] = value;
    return this;
  }

  public to(type: ScopeTo): this {
    switch (type) {
      case "container":
        if (typeof this._parent === "undefined") return this;
        return this._type !== "container" ? this._parent.to(type) : this;
      case "request":
        if (typeof this._parent === "undefined") return this;
        return this._parent._type !== "container"
          ? this._parent.to(type)
          : this;
      case "singleton":
        return typeof this._parent !== "undefined"
          ? this._parent.to(type)
          : this;
      default:
        return this;
    }
  }
}
