import {
  ScopeInterface,
  ScopeKey,
  ScopeType,
  WalkType,
} from "./contracts/scope.js";

export class Scope implements ScopeInterface {
  protected _parent?: this;

  protected _record: Record<ScopeKey, unknown> = {};

  protected _type: ScopeType;

  public constructor(type: ScopeType, parent?: Scope) {
    this._parent = parent as this;
    this._type = type;
  }

  public clearRecord(key: ScopeKey): this {
    if (typeof this._parent !== "undefined") this._record[key] = undefined;
    else delete this._record[key];
    return this;
  }

  public fork(type: ScopeType): this {
    const Static = this.constructor as typeof Scope;
    return new Static(type, this) as this;
  }

  public getParent(): this | undefined {
    return this._parent;
  }

  public getRecord(key: ScopeKey): unknown {
    if (key in this._record) return this._record[key];
    return typeof this._parent !== "undefined"
      ? this._parent.getRecord(key)
      : undefined;
  }

  public getType(): ScopeType {
    return this._type;
  }

  public hasRecord(key: ScopeKey): boolean {
    if (key in this._record) return typeof this._record[key] !== "undefined";
    return typeof this._parent !== "undefined"
      ? this._parent.hasRecord(key)
      : false;
  }

  public setRecord(key: ScopeKey, value: unknown): this {
    this._record[key] = value;
    return this;
  }

  public walkTo(walkType: WalkType): this {
    switch (walkType) {
      case "container":
        if (typeof this._parent === "undefined") return this;
        return this._type !== "container"
          ? this._parent.walkTo(walkType)
          : this;
      case "request":
        if (typeof this._parent === "undefined") return this;
        return this._parent._type !== "container"
          ? this._parent.walkTo(walkType)
          : this;
      case "singleton":
        return typeof this._parent !== "undefined"
          ? this._parent.walkTo(walkType)
          : this;
      default:
        return this;
    }
  }
}
