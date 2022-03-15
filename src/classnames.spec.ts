import classnames, { classnamesWithScope } from "./classnames";
import data from "./classnames.data";

describe("classnames()", () => {
  const props = {
    size: "large",
    color: "blue",
    className: "awesome-class react-rocks",
    disabled: true,
    stateful: false,
    format: null,
    placeholder: undefined,
  };

  const state = {
    mode: "active",
    className: "state-class",
  };

  const variations = {
    $all: "flex-col items-center",

    size: {
      large: "p-lg m-lg",
      small: "p-lg m-lg",
    },

    color: {
      red: "red",
      blue: "blue",
    },

    mode: {
      active: "active-class",
      normal: "normal-class",
    },

    format: {
      text: "txt",
      digit: "digit",
    },

    placeholder: "placeholder-color",

    disabled: "input-disabled",

    stateful: "stateful-component",
  };

  it("maps string-based variations correctly", (): void => {
    const result = classnames(variations, props, state);

    expect(result).toContain("p-lg");
    expect(result).toContain("m-lg");
    expect(result).toContain("blue");
    expect(result).toContain("active-class");
    expect(result).toContain("input-disabled");
  });

  it("while maps string-based variations, does not include not-matching variations", (): void => {
    const result = classnames(variations, props, state);

    expect(result).not.toContain("p-sm");
    expect(result).not.toContain("m-sm");
    expect(result).not.toContain("red");
    expect(result).not.toContain("normal-class");
    expect(result).not.toContain("stateful-component");
    expect(result).not.toContain("txt");
    expect(result).not.toContain("digit");
    expect(result).not.toContain("placeholder-color");
  });

  it("includes the generic classes", (): void => {
    const result = classnames(variations, props, state);

    expect(result).toContain("flex-col");
    expect(result).toContain("items-center");
  });

  it("includes provided className values", (): void => {
    const result = classnames(variations, props, state);

    expect(result).toContain("awesome-class");
    expect(result).toContain("react-rocks");
    expect(result).toContain("state-class");
  });

  it("supports nullable sources", (): void => {
    expect(() => classnames(variations, null, undefined)).not.toThrowError();
  });

  it("supports a single source", (): void => {
    expect(() => classnames(variations, props)).not.toThrowError();
  });

  it("output is in correct format", (): void => {
    const result = classnames(variations, props, state);

    expect(result).toEqual(
      "flex-col items-center p-lg m-lg blue active-class input-disabled awesome-class react-rocks state-class",
    );
  });

  it("includes the matching classes for a field -> value -> CSS mapping", (): void => {
    const v = { name: { foo: "FOO", bar: "BAR" } };
    const s = { name: "foo" };

    const result = classnames(v, s);
    expect(result).toEqual("FOO");
  });

  it("when value in source is not matching anything in field -> value -> CSS, resolves nothing", () => {
    const v = { color: { red: "RED", blue: "BLUE" } };
    const s = { color: "green" };

    const result = classnames(v, s);
    expect(result).toEqual("");
  });

  it("includes the matching class for a field -> value -> field -> value -> CSS mapping", (): void => {
    const v = {
      color: {
        red: { size: { small: "red-small", large: "red-large" } },
        blue: { size: { small: "red-small", large: "red-large" } },
      },
    };

    const s = { color: "red", size: "large" };

    const result = classnames(v, s);
    expect(result).toEqual("red-large");
  });

  it("when value in source does not match a value in field -> value -> field -> value -> CSS mapping, returns nothing", (): void => {
    const v = {
      color: {
        red: { size: { small: "red-small", large: "red-large" } },
        blue: { size: { small: "red-small", large: "red-large" } },
      },
    };

    const s = { color: "red", size: "medium" };

    const result = classnames(v, s);
    expect(result).toEqual("");
  });

  it("resolves the correct value for a field -> value -> field -> value -> field -> value -> CSS mapping", (): void => {
    const v = {
      color: {
        red: {
          size: {
            small: { outline: { true: "red-small-outline", false: "red-small-normal" } },
            large: { outline: { true: "red-large-outline", false: "red-large-normal" } },
          },
        },
      },
    };

    const s = { color: "red", size: "large", outline: false };

    const result = classnames(v, s);
    expect(result).toEqual("red-large-normal");
  });

  it("when provided with more than one nested condition, matches them all", (): void => {
    const v = {
      color: {
        red: {
          size: { small: "red-small", large: "red-large" },
          outline: { true: "red-outline", false: "red-normal" },
        },
        blue: {
          size: { small: "blue-small", large: "blue-large" },
          outline: { true: "blue-outline", false: "blue-normal" },
        },
      },
    };

    const s = { color: "blue", size: "large", outline: false };

    const result = classnames(v, s);
    expect(result).toEqual("blue-large blue-normal");
  });

  it("does not include $none when there is a match", (): void => {
    const v = {
      color: {
        $none: "color-none",
        red: {
          size: { small: "red-small", large: "red-large", $none: "red-size-none" },
          outline: { true: "red-outline", false: "red-normal" },
        },
        blue: {
          size: { small: "blue-small", large: "blue-large" },
          outline: { true: "blue-outline", false: "blue-normal" },
        },
      },
    };

    const s = { color: "red", size: "small", outline: true };

    const result = classnames(v, s);
    expect(result).not.toContain("color-none");
    expect(result).not.toContain("red-size-none");
  });

  it("returns nothing when source does not contain any value", (): void => {
    const v = { color: { red: "RED", blue: "BLUE" } };
    const s = { color: null };

    const result = classnames(v, s);
    expect(result).toEqual("");
  });

  it("returns $nil classes when source does not contain any value and $nil is provided", (): void => {
    const v = { color: { red: "RED", blue: "BLUE", $nil: "NIL" } };
    const s = { color: null };

    const result = classnames(v, s);
    expect(result).toEqual("NIL");
  });

  it("returns $none classes when source does not match the variations and $none is provided", (): void => {
    const v = { color: { red: "RED", blue: "BLUE", $none: "NONE" } };
    const s = { color: "green" };

    const result = classnames(v, s);
    expect(result).toEqual("NONE");
  });

  it("returns nothing when field does not have any variations", (): void => {
    const v = { color: { red: "RED", blue: "BLUE" } };
    const s = { color: null };

    const result = classnames(v, s);
    expect(result).toEqual("");
  });

  it("classnames with scope should resolved as classnames", (): void => {
    const v = {
      size: {
        sm: "p-1",
        md: "p-2",
      },
    };

    const sc = {
      container: {
        ...v,
        $always: "border border-gray",
        color: {
          red: "bg-red",
          blue: "bg-blue",
        },
      },
      wrapper: {
        ...v,
        $forward: false,
        $always: "border",
        color: {
          red: "border-red",
          blue: "border-blue",
        },
      },
    };

    const s = { color: "red", size: "sm", className: "CLASSNAME" };

    const result = classnamesWithScope(sc, s);

    // expect keys to be returned back
    expect(result).toHaveProperty("container");
    expect(result).toHaveProperty("wrapper");

    // expect key values to match a classnames output
    expect(classnames(sc.container, s)).toEqual(result.container);
    expect(classnames(sc.wrapper, s)).toEqual(result.wrapper);
  });

  data.forEach((td) => {
    it(td.title, () => {
      const result = classnames(td.variation, ...td.sources);
      expect(result).toEqual(td.expect);
    });
  });
});
