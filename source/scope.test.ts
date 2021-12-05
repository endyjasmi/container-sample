import { Scope } from "./scope.js";

describe("Scope", () => {
  let root: Scope<unknown>;
  let rootChild: Scope<unknown>;
  beforeEach(() => {
    root = new Scope();
    rootChild = root.fork();
  });

  describe("get parent()", () => {
    test("when called from root, it should returns undefined", () => {
      const parent = root.parent;
      expect(parent).toBeUndefined();
    });
    test("when called from root child, it should returns parent", () => {
      const parent = rootChild.parent;
      expect(parent).toBeInstanceOf(Scope);
    });
  });

  describe("get record()", () => {
    test("when called from root and there is record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const record = root.record;
      expect(record).toEqual({
        "key-0": "value-0",
        "key-1": "value-1",
        "key-2": "value-2",
      });
    });
    test("when called from root and there is cleared record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      root.clear("key-1");

      const record = root.record;
      expect(record).toEqual({
        "key-0": "value-0",
        "key-2": "value-2",
      });
    });
    test("when called from root and there is empty record, it should returns record", () => {
      const record = root.record;
      expect(record).toEqual({});
    });
    test("when called from root child and there is record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const record = rootChild.record;
      expect(record).toEqual({
        "key-0": "value-0",
        "key-1": "value-1",
        "key-2": "value-2",
      });
    });
    test("when called from root child and there is cleared record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      rootChild.clear("key-1");

      const record = rootChild.record;
      expect(record).toEqual({
        "key-0": "value-0",
        "key-2": "value-2",
      });
    });
    test("when called from root child and there is empty record, it should returns record", () => {
      const record = rootChild.record;
      expect(record).toEqual({});
    });
  });

  describe("#clear(key)", () => {
    test("when called from root and there is record, it should returns self", () => {
      root.set("key", "value");

      const self = root.clear("key");
      expect(self).toBe(root);
    });
    test("when called from root and there is no record, it should returns self", () => {
      const self = root.clear("key");
      expect(self).toBe(root);
    });
    test("when called from root child and there is record, it should returns self", () => {
      root.set("key", "value");

      const self = rootChild.clear("key");
      expect(self).toBe(rootChild);
    });
    test("when called from root child and there is no record, it should returns self", () => {
      const self = rootChild.clear("key");
      expect(self).toBe(rootChild);
    });
  });

  describe("#entries()", () => {
    test("when called from root and there is record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const entries = root.entries();
      expect(entries).toEqual([
        ["key-0", "value-0"],
        ["key-1", "value-1"],
        ["key-2", "value-2"],
      ]);
    });
    test("when called from root and there is cleared record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      root.clear("key-1");

      const entries = root.entries();
      expect(entries).toEqual([
        ["key-0", "value-0"],
        ["key-2", "value-2"],
      ]);
    });
    test("when called from root and there is empty record, it should returns record", () => {
      const entries = root.entries();
      expect(entries).toEqual([]);
    });
    test("when called from root child and there is record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const entries = rootChild.entries();
      expect(entries).toEqual([
        ["key-0", "value-0"],
        ["key-1", "value-1"],
        ["key-2", "value-2"],
      ]);
    });
    test("when called from root child and there is cleared record, it should returns record", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      rootChild.clear("key-1");

      const entries = rootChild.entries();
      expect(entries).toEqual([
        ["key-0", "value-0"],
        ["key-2", "value-2"],
      ]);
    });
    test("when called from root child and there is empty record, it should returns record", () => {
      const entries = rootChild.entries();
      expect(entries).toEqual([]);
    });
  });

  describe("#fork()", () => {
    test("when called from root, it should returns child", () => {
      const child = root.fork();
      expect(child).toHaveProperty("parent", root);
    });
    test("when called from root child, it should returns child", () => {
      const child = rootChild.fork();
      expect(child).toHaveProperty("parent", rootChild);
    });
  });

  describe("#get(key)", () => {
    test("when called from root and there is record, it should returns value", () => {
      root.set("key", "value");

      const value = root.get("key");
      expect(value).toBe("value");
    });
    test("when called from root and there is no record, it should returns value", () => {
      const value = root.get("key");
      expect(value).toBeUndefined();
    });
    test("when called from root child and there is record, it should returns value", () => {
      root.set("key", "value");

      const value = rootChild.get("key");
      expect(value).toBe("value");
    });
    test("when called from root child and there is no record, it should returns value", () => {
      const value = rootChild.get("key");
      expect(value).toBeUndefined();
    });
  });

  describe("#has(key)", () => {
    test("when called from root and there is record, it should returns true", () => {
      root.set("key", "value");

      const has = root.has("key");
      expect(has).toBeTrue();
    });
    test("when called from root and there is no record, it should returns false", () => {
      const has = root.has("key");
      expect(has).toBeFalse();
    });
    test("when called from root child and there is record, it should returns true", () => {
      root.set("key", "value");

      const has = rootChild.has("key");
      expect(has).toBeTrue();
    });
    test("when called from root child and there is no record, it should returns false", () => {
      const has = rootChild.has("key");
      expect(has).toBeFalse();
    });
  });

  describe("#keys()", () => {
    test("when called from root and there is record, it should returns keys", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const keys = root.keys();
      expect(keys).toEqual(["key-0", "key-1", "key-2"]);
    });
    test("when called from root and there is cleared record, it should returns keys", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      root.clear("key-1");

      const keys = root.keys();
      expect(keys).toEqual(["key-0", "key-2"]);
    });
    test("when called from root and there is empty record, it should returns keys", () => {
      const keys = root.keys();
      expect(keys).toEqual([]);
    });
    test("when called from root child and there is record, it should returns keys", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const keys = rootChild.keys();
      expect(keys).toEqual(["key-0", "key-1", "key-2"]);
    });
    test("when called from root child and there is cleared record, it should returns keys", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      rootChild.clear("key-1");

      const keys = rootChild.keys();
      expect(keys).toEqual(["key-0", "key-2"]);
    });
    test("when called from root child and there is empty record, it should returns keys", () => {
      const keys = rootChild.keys();
      expect(keys).toEqual([]);
    });
  });

  describe("#set(key, value)", () => {
    test("when called from root and there is record, it should returns self", () => {
      root.set("key", "value");

      const self = root.set("key", "mutation");
      expect(self).toBe(root);
    });
    test("when called from root and there is no record, it should returns self", () => {
      const self = root.set("key", "mutation");
      expect(self).toBe(root);
    });
    test("when called from root child and there is record, it should returns self", () => {
      root.set("key", "value");

      const self = rootChild.set("key", "mutation");
      expect(self).toBe(rootChild);
    });
    test("when called from root child and there is no record, it should returns self", () => {
      const self = rootChild.set("key", "mutation");
      expect(self).toBe(rootChild);
    });
  });

  describe("#values()", () => {
    test("when called from root and there is record, it should returns values", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const values = root.values();
      expect(values).toEqual(["value-0", "value-1", "value-2"]);
    });
    test("when called from root and there is cleared record, it should returns values", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      root.clear("key-1");

      const values = root.values();
      expect(values).toEqual(["value-0", "value-2"]);
    });
    test("when called from root and there is empty record, it should returns values", () => {
      const values = root.values();
      expect(values).toEqual([]);
    });
    test("when called from root child and there is record, it should returns values", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");

      const values = rootChild.values();
      expect(values).toEqual(["value-0", "value-1", "value-2"]);
    });
    test("when called from root child and there is cleared record, it should returns values", () => {
      root.set("key-0", "value-0");
      root.set("key-1", "value-1");
      root.set("key-2", "value-2");
      rootChild.clear("key-1");

      const values = rootChild.values();
      expect(values).toEqual(["value-0", "value-2"]);
    });
    test("when called from root child and there is empty record, it should returns values", () => {
      const values = rootChild.values();
      expect(values).toEqual([]);
    });
  });
});
