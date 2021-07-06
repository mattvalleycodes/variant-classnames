import isString from "./is-string";

describe("isString()", () => {
  it("returns true for string values", () => {
    expect(isString("foo")).toBeTruthy();
  });

  it("returns false for non-string values", () => {
    expect(isString(null)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(1)).toBeFalsy();
    expect(isString(false)).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString({})).toBeFalsy();
  });
});
