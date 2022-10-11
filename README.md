# variant-classnames
A simple Javascript utility function for generating CSS class names based on the provided React component props. `variant-classnames` is just like [classnames](https://github.com/JedWatson/classnames), without boilerplate code. `variant-classnames is unit tested and is ready for production use.`

If you're looking for a production-scale application that uses `variant-classnames`, please have a look at [Testfully](https://app.testfully.io).

> The whole classname thing is popular in React eco-system, but it doesn't mean that you can't use `variant-classnames` with any other framework. We're framework/library agnostic.

## Installation

```
# via npm
npm i variant-classnames

# via yarn
yarn add variant-classnames
```

## Usage

The `cn` function receives two object arguments:
- `variants`: A map of prop values and their corresponding CSS classes
- `props`: Provided props to your component


## Examples

Let's build a `<Button />` component. It supports two colors (blue, red), two sizes (small, large), and a disabled state. We will use [Tailwind CSS](https://tailwindcss.com/) to style our components, but you can attach any CSS classes. To keep it simple, the `<Button />` component does not support default props. That said, `variant-classnames` works with default props as well.

```tsx
import React from "react";
import cn from "variant-classnames";

type ButtonProps = {
  className?: string;
  text: string;
  color: "red" | "blue";
  size: "small" | "large";
  disabled?: boolean;
};

export const Button:React.FC<ButtonProps> = (props) => {
  const variants = {
    // class names for "color" variants
    color: {
      red: "bg-red-100 text-red", // <- will be applied to <Button color="red" />
      blue: "bg-blue-100 text-blue", // <- will be applied to <Button color="blue" />
    },

    // class names for "size" variants
    size: {
      small: "text-sm py-5 px-2", // <- will be applied to <Button size="small" />
      large: "text-md py-8 px-4", // <- will be applied to <Button size="large" />
    },

    // class names for "disabled" variants
    disabled: {
      true: "cursor-not-allowed opacity-5", // <-  will be applied to <Button disabled />
    },
  };

  const classes = cn(variants, props);

  return <button className={classes}>{props.text}</button>
}
```

Provided with `<Button size="small" color="red" />`, the following CSS classes will be attached to `<button />`:
```
color=red           size=small
------------------- -----------------
bg-red-100 text-red text-sm py-5 px-2
```

Provided with `<Button size="small" color="blue" disabled />`, the following CSS classes will be attached to `<button />`:
```
color=blue            size=small        disabled=true
--------------------- ----------------- ----------------------------
bg-blue-100 text-blue text-sm py-5 px-2 cursor-not-allowed opacity-5
```

## FAQ

_How do I join the value of the `className` prop?_
`cn` will do the job. For example, `<Button size="small" color="blue" className="my-class" /> ` transforms to:


```
color=blue            size=small        className
--------------------- ----------------- ----------
bg-blue-100 text-blue text-sm py-5 px-2 my-class
```


_How do I join a set of CSS classes to all variants?_
Use the `$all` directive.

```tsx

import React from "react";
import cn from "variant-classnames";

type ButtonProps = {
  text: string;
  color: "red" | "blue";
};

export const Button:React.FC<ButtonProps> = (props) => {
  const variants = {
    $all: "py-4 px-2", // <- this will be always included

    // class names for "color" variants
    color: {
      red: "bg-red-100 text-red", // <- will be applied to <Button color="red" />
      blue: "bg-blue-100 text-blue", // <- will be applied to <Button color="blue" />
    },
  };

  const classes = cn(variants, props);

  return <button className={classes}>{props.text}</button>
}
```


_Can I do nesting of variants?_
Yes, you can! Let's say the color of our button is different based on "disabled" state. We can write the following code:


```tsx

import React from "react";
import cn from "variant-classnames";

type ButtonProps = {
  text: string;
  color: "red" | "blue";
  disabled?: boolean;
};

export const Button:React.FC<ButtonProps> = (props) => {
  const variants = {
    $all: "py-4 px-2", // <- this will be always included

    // class names for "color" variants
    color: {
      red: {
        $all: "text-red", // <- this will be always included when <Button color="red" /> is set
        disabled: {
          true: "bg-red-400", // <- this wil be applied to <Button color="red" disabled />
          false: "bg-red-200", // <- this wil be applied to <Button color="red"  />
        },
      },
      blue: {
        $all: "text-blue", // <- this will be always included when <Button color="blue" /> is set
        disabled: {
          true: "bg-blue-400", // <- this wil be applied to <Button color="blue" disabled />
          false: "bg-blue-200", // <- this wil be applied to <Button color="blue"  />
        },
      },
    },

    // class names for "disabled" variants
    disabled: {
      true: "cursor-not-allowed opacity-5", // <-  will be applied to <Button disabled />
    },
  };

  const classes = cn(variants, props);

  return <button className={classes}>{props.text}</button>
}
```


_Can I use cn with objects other than props?_

Yes, you can! The second argument can be anything, as long as it's an object.


## Typings
You get types autocompletion when creating your variants object by importing either `VariantsOf | VxOf` types.

### Invalid property name

```ts
import vx, { VxOf } from "variant-classnames";

const props = {
  disabled: true,
};

const variants: VxOf<typeof props> = {
  disabled: "when-disabled",
  primary: "when-primary", // <-- ts will complain here as `primary` does not exist in `props`
};

console.log("-->", vx(variants, props)); // --> when-disabled
```

### Nested properties auto complete

```ts
import vx, { VxOf } from "variant-classnames";

type Props = {
  disabled: boolean;
  type: "primary" | "secondary";
  color?: "blue" | "red";
};

const props: Props = {
  disabled: true,
  type: "primary",
  color: "blue",
};

const variants: VxOf<typeof props> = {
  $forward: "",
  type: {
    $notnil: "string",
    $nil: "string",
    primary: "when [type] is (primary)",
    $none: {
      color: {
        blue: "when [type] is neither (primary | secondary) and [color] is (red)",
        $none: "when [type] is neither (primary|secondary) and [color] is neither (red | blue)",
      },
    },
  },
  color: {
    blue: {
      disabled: {
        true: "when [color] is (blue) and [disabled] is (true)",
      },
    },
  },
};

console.log("-->", vx(variants, props)); // --> string when [type] is (primary) when [color] is (blue) and [disabled] is (true)

```

## Tailwind CSS IntelliSense in VSCode

Want to get auto complete when writing tailwind css classnames in VSCode? No problem!

### Setup

1. Install [Tailwind CSS classRegex extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
2. Update your workspace settings (JSON)
```json
{
  "tailwindCSS.classAttributes": ["class", "className", "ngClass"],
  "tailwindCSS.experimental.classRegex": [
    ["vc\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["/\\*tw\\*/ ([^;]*);", "'([^']*)'"]
  ]
}
```
here please note that:
- `classAttributes` can be extended, allowing to add new selectors to get the autocompletion. in the case above we have added `ngClass`, hence now `<button ngClass="...">` will have the intellisense.
- `classRegex` is similar, but will allow us to target a custom block of code that we want to have the intellisense on. In our case we have added 2 ways:
  - Any object within `vc({ ... }`
  - Any object tagged with `/* tw */ { ... }`

### Usage
- Using `vc` import classnames as `import vc from 'classnames'`
```ts
const classNames = vc({
  disabled: "text-red-300 cursor- ", // <-- ctrl+space to get autocompletion
} as VxOf<typeof props>, props)
```
- Using `/*tw*/` tag
```ts
const props: VxOf<typeof props> = { disabled: true }
const variants:  = /* tw */ {
  disabled: {
    true: "opacity-100 bg-gray- ", // <-- ctrl+space to get autocompletion
    false: "opacity-0",
  }
}
```

### Troubleshooting 🐛
The intellisense plugin has max depth at which it stops providing the auto completion.
To overcome this you can tag any of the nested objects again. (Sorry not perfect! 🙃)

<details>
  <summary>See example</summary>

  ```ts
  const vBtn = /*tw*/ {
    $all: 'group flex items-center relative px-8 py-4 text-base font-bold leading-6 capitalize focus:ring ',

    flex: 'w-full justify-center',

    type: {
      primary: 'text-white',
      secondary:
        'bg-white outline hover:outline-transparent active:outline-transparent',
    },

    disabled: {
      false: /*tw*/ {
        color: {
          black: {
            type: {
              primary: 'bg-zinc-900 hover:bg-zinc-600 active:bg-zinc-700  ',
              secondary:
                'text-zinc-900 outline outline-zinc-900 hover:bg-zinc-200 active:bg-zinc-400 active:text-white',
              ghost: 'hover:text-zinc-600 active:text-zinc-700',
            },
          },
          blue: {
            type: {
              primary: 'bg-blue-900 hover:bg-blue-600 active:bg-blue-700',
              secondary:
                'text-blue-900 outline-blue-900 hover:bg-blue-200 active:bg-blue-400 active:text-white',
              ghost: 'text-blue-900 hover:text-blue-600 active:text-blue-700',
            },
          },
          red: {
            type: {
              primary: 'bg-red-700 hover:bg-red-500 active:bg-red-600',
              secondary:
                'text-red-700 outline-red-700 hover:bg-red-200 active:bg-red-300 active:text-white',
              ghost: 'text-red-700 hover:text-red-500 active:text-red-600',
            },
          },
        },
      },
      true: /*tw*/ {
        color: {
          black: {
            type: {
              primary:
                'bg-zinc-400 text-zinc-200 focus:ring-0 cursor-not-allowed ',
            },
          },
          blue: {
            type: {
              primary:
                'bg-blue-400 text-blue-200 focus:ring-0 cursor-not-allowed',
            },
          },
          red: {
            type: {
              primary: 'bg-red-300 text-red-200 focus:ring-0 cursor-not-allowed',
            },
          },
        },
      },
    },
  };
  ```
</details>


## LICENSE MIT

Copyright (c) 2021 Matt Valley.
