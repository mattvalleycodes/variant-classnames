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

## LICENSE MIT

Copyright (c) 2021 Matt Valley.