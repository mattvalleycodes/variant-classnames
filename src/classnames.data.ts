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
    title: "standard map of props to classnames with $all hook",
    sources: [{ color: blue, size: large }],
    expect: [gray, blue, pink, large].join(" "),
    variation: { color: { $all: gray, red, blue }, size: { $all: pink, small, large } },
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
    title: "accepts variations for $all",
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
    title: "accepts variations for $all nested in other variations",
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
    expect: ["all-classes", pink].join(" "),
    variation: {
      $all: "all-classes",
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
];

export default data;
