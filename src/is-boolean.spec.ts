import isBoolean from "./is-boolean";

describe("isBoolean()", () => {
  it("returns true for boolean values", () => {
    expect(isBoolean(true)).toBeTruthy();
    expect(isBoolean(false)).toBeTruthy();
  });

  it("returns false for non-boolean values", () => {
    expect(isBoolean("foo")).toBeFalsy();
    expect(isBoolean(null)).toBeFalsy();
    expect(isBoolean(undefined)).toBeFalsy();
    expect(isBoolean(1)).toBeFalsy();
    expect(isBoolean([])).toBeFalsy();
    expect(isBoolean({})).toBeFalsy();
  });
});
