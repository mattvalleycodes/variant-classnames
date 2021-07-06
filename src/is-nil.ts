function isNil(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

export default isNil;
