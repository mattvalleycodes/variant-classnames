import isNil from "./is-nil";

describe("isNil()", () => {
  it("returns true for null/undefined values", () => {
    expect(isNil(null)).toBeTruthy();
    expect(isNil(undefined)).toBeTruthy();
  });

  it("returns false for non-null or non-undefined values", () => {
    expect(isNil("foo")).toBeFalsy();
    expect(isNil(1)).toBeFalsy();
    expect(isNil(false)).toBeFalsy();
    expect(isNil([])).toBeFalsy();
    expect(isNil({})).toBeFalsy();
  });
});
