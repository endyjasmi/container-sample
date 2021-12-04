import { Tester } from "./tester.js";

describe("Tester", () => {
  let tester: Tester;
  beforeEach(() => {
    tester = new Tester();
  });
  test("#random()", () => {
    const random = tester.random();
    expect(random).toBeNumber();
  });
});
