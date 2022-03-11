import { Variations, Source } from "./classnames";

const red = "red";
const blue = "blue";
const small = "small";
const large = "large";
const gray = "gray";
const pink = "pink";
const purple = "purple";

const data: Array<{ title: string; variation: Variations; sources: Array<Source>; expect: string }> = [
  {
    title: "standard map of props to classnames",
    sources: [{ color: blue, size: large }],
    expect: [blue, large].join(" "),
    variation: { color: { red, blue }, size: { small, large } },
  },

  {
    title: "standard map of props to classnames with $all hook (deprecated)",
    sources: [{ color: blue, size: large }],
    expect: [gray, blue, pink, large].join(" "),
    variation: { color: { $all: gray, red, blue }, size: { $all: pink, small, large } },
  },

  {
    title: "standard map of props to classnames with $always hook",
    sources: [{ color: blue, size: large }],
    expect: [gray, blue, pink, large].join(" "),
    variation: { color: { $always: gray, red, blue }, size: { $always: pink, small, large } },
  },

  {
    title: "$nil support with null as prop value",
    sources: [{ color: null, size: large }],
    expect: [pink, large].join(" "),
    variation: { color: { $nil: pink, red, blue }, size: { small, large } },
  },

  {
    title: "$nil support with undefined as prop value",
    sources: [{ color: undefined, size: large }],
    expect: [pink, large].join(" "),
    variation: { color: { $nil: pink, red, blue }, size: { small, large } },
  },

  {
    title: "$none support",
    sources: [{ color: gray, size: large }],
    expect: [pink, large].join(" "),
    variation: { color: { $none: pink, red, blue }, size: { small, large } },
  },

  {
    title: "accepts variations for $all (deprecated)",
    sources: [{ color: blue, size: large }],
    expect: [blue, large].join(" "),
    variation: {
      $all: {
        color: {
          red,
          blue,
        },

        size: {
          small,
          large,
        },
      },
    },
  },

  {
    title: "accepts variations for $always",
    sources: [{ color: blue, size: large }],
    expect: [blue, large].join(" "),
    variation: {
      $always: {
        color: {
          red,
          blue,
        },

        size: {
          small,
          large,
        },
      },
    },
  },

  {
    title: "accepts variations for $all nested in other variations (deprecated)",
    sources: [{ color: blue, size: large }],
    expect: [red, large].join(" "),
    variation: {
      color: {
        red: {
          $all: {
            size: {
              small: red,
              large: blue,
            },
          },
        },
        blue: {
          $all: {
            size: {
              small: blue,
              large: red,
            },
          },
        },
      },
      size: { small, large },
    },
  },

  {
    title: "should accept $all in any level (deprecated)",
    sources: [{ color: "blue", size: "large", outline: false }],
    expect: "all-vars all-blues all-sizes blue-large all-outlines blue-normal all-colors",
    variation: {
      $all: "all-vars",
      color: {
        $all: "all-colors",
        red: {},
        blue: {
          $all: "all-blues",
          size: {
            $all: "all-sizes",
            small: "blue-small",
            large: "blue-large",
          },
          outline: {
            $all: "all-outlines",
            true: "blue-outline",
            false: "blue-normal",
          },
        },
      },
    },
  },

  {
    title: "should accept $always in any level (deprecated)",
    sources: [{ color: "blue", size: "large", outline: false }],
    expect: "all-vars all-blues all-sizes blue-large all-outlines blue-normal all-colors",
    variation: {
      $always: "all-vars",
      color: {
        $all: "all-colors",
        red: {},
        blue: {
          $all: "all-blues",
          size: {
            $all: "all-sizes",
            small: "blue-small",
            large: "blue-large",
          },
          outline: {
            $all: "all-outlines",
            true: "blue-outline",
            false: "blue-normal",
          },
        },
      },
    },
  },

  {
    title: "accepts variations for $always nested in other variations",
    sources: [{ color: blue, size: large }],
    expect: [red, large].join(" "),
    variation: {
      color: {
        red: {
          $always: {
            size: {
              small: red,
              large: blue,
            },
          },
        },
        blue: {
          $always: {
            size: {
              small: blue,
              large: red,
            },
          },
        },
      },
      size: { small, large },
    },
  },

  {
    title: "accepts variations for $none",
    sources: [{ color: purple, default: pink }],
    expect: [pink].join(" "),
    variation: {
      color: {
        red,
        blue,
        $none: {
          default: {
            gray,
            pink,
          },
        },
      },
    },
  },

  {
    title: "accepts variations for $nil",
    sources: [{ color: null, default: pink }],
    expect: pink,
    variation: {
      color: {
        red,
        blue,
        $nil: {
          default: {
            gray,
            pink,
          },
        },
      },
    },
  },

  {
    title: "nested $all when mapped prop has no value (deprecated)",
    sources: [{ color: red }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $all: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $always when mapped prop has no value",
    sources: [{ color: red }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $always: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $all when mapped prop has a value (deprecated)",
    sources: [{ color: red, size: large }],
    expect: ["shared-size-class", large, red].join(" "),
    variation: {
      size: {
        $all: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $always when mapped prop has a value",
    sources: [{ color: red, size: large }],
    expect: ["shared-size-class", large, red].join(" "),
    variation: {
      size: {
        $always: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $all when mapped prop has null value (deprecated)",
    sources: [{ color: red, size: null }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $all: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $always when mapped prop has null value",
    sources: [{ color: red, size: null }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $always: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $all when mapped prop has undefind value (deprecated)",
    sources: [{ color: red, size: undefined }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $all: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "nested $always when mapped prop has undefind value",
    sources: [{ color: red, size: undefined }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $always: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "$none when provided value does not have a match",
    sources: [{ color: red, size: "xl" }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $none: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "$none when null provided as the value",
    sources: [{ color: red, size: null }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $none: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "$none when undefined provided as the value",
    sources: [{ color: red, size: undefined }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $none: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "$none when no value is provided",
    sources: [{ color: red }],
    expect: ["shared-size-class", red].join(" "),
    variation: {
      size: {
        $none: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },

  {
    title: "$none won't be applied when there is a matching value",
    sources: [{ color: red, size: large }],
    expect: [large, red].join(" "),
    variation: {
      size: {
        $none: "shared-size-class",
        small,
        large,
      },
      color: {
        red,
        blue,
      },
    },
  },
  {
    title: "empty ouput when source is falsy: string",
    sources: [{ color: "" }],
    variation: { color: [blue, red].join(" ") },
    expect: "",
  },
  {
    title: "empty ouput when source is falsy: undefined",
    sources: [{ color: undefined }],
    variation: { color: [blue, red].join(" ") },
    expect: "",
  },
  {
    title: "empty ouput when source is falsy: null",
    sources: [{ color: null }],
    variation: { color: [blue, red].join(" ") },
    expect: "",
  },
  {
    title: "empty ouput when source is falsy: number",
    sources: [{ color: 0 }],
    variation: { color: [blue, red].join(" ") },
    expect: "",
  },
  {
    title: "empty ouput when source is falsy: boolean",
    sources: [{ color: false }],
    variation: { color: [blue, red].join(" ") },
    expect: "",
  },
  {
    title: "valid ouput when source is thruthy: string",
    sources: [{ color: "123" }],
    variation: { color: [blue, red].join(" ") },
    expect: [blue, red].join(" "),
  },
  {
    title: "valid ouput when source is thruthy: number",
    sources: [{ color: 123 }],
    variation: { color: [blue, red].join(" ") },
    expect: [blue, red].join(" "),
  },
  {
    title: "valid ouput when source is thruthy: boolean",
    sources: [{ color: true }],
    variation: { color: [blue, red].join(" ") },
    expect: [blue, red].join(" "),
  },
  {
    title: "valid ouput when source is thruthy: object",
    sources: [{ color: {} }],
    variation: { color: [blue, red].join(" ") },
    expect: [blue, red].join(" "),
  },
];

export default data;
