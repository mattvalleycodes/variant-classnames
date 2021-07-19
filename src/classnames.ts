import isNil from "./is-nil";
import isString from "./is-string";

type MaybeString = string | null | undefined;

export type Variations = {
  $all?: MaybeString | Variations;
  $none?: MaybeString | Variations;
  $nil?: MaybeString | Variations;
  [key: string]: MaybeString | Variations;
};

export type Source = {
  className?: MaybeString;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const $all = "$all";
const $none = "$none";
const $nil = "$nil";

export function get(
  prop: string,
  valueVariations: Variations | string | null | undefined,
  source: Source,
): MaybeString {
  let correspondingSourceValue = source[prop];

  // for the provided prop, there is no variation, we should not continue
  if (isNil(valueVariations)) return null;

  // this is a $all hook and if it is set to actual CSS classes (string), we should return value here.
  if (prop === $all) {
    if (isString(valueVariations) || isNil(valueVariations)) return valueVariations;

    return Object.keys(valueVariations)
      .map((nestedProp) => get(nestedProp, valueVariations[nestedProp], source))
      .filter((v) => !isNil(v))
      .join(" ");
  }

  // there is no further variatios to inspect, we're dealing with props -> css class case here
  // we need to finish the execution at this point
  if (isString(valueVariations)) {
    // prop -> css class basically means include classes when prop value is `true`
    if (correspondingSourceValue === true) return valueVariations;

    // prop -> css class and prop value is not true, this is no match so we should return nothing
    return null;
  }

  // when prop has no value, we pretent value is $nil to be able to kick off $nil hook later.
  if (isNil(correspondingSourceValue)) correspondingSourceValue = $nil;

  // at this stage we're dealing with prop -> a range of variations (this is an object)
  // we need to resolve the variation that match current value of the prop
  // if value of the prop doesn't have a match, we should divert to $none hook here.
  const matchingVariations = valueVariations[correspondingSourceValue.toString()] || valueVariations[$none];

  // this means we're either prop -> null / string so we don't need to dig more
  if (isNil(matchingVariations) || isString(matchingVariations)) {
    // prop value (or $none) doesn't map to any variation
    // return value of $all hook, when it's available.
    if (isNil(matchingVariations)) {
      const allVar = valueVariations[$all];

      // if $all hook maps to string/null, just return it. no need to dig more
      if (isString(allVar) || isNil(allVar)) return allVar;

      // $all maps to an object we should dig more
      return Object.keys(allVar)
        .map((nestedProp) => get(nestedProp, allVar[nestedProp], source))
        .filter((v) => !isNil(v))
        .join(" ");
    }

    // prop value (or $none) maps to string, if we don't have $all just return what we got
    if (isNil(valueVariations.$all)) return matchingVariations;

    // prop value (or $none) maps to string, we also got the $all hook, combine and return
    return `${valueVariations.$all} ${matchingVariations}`;
  }

  return Object.keys(matchingVariations)
    .map((nestedProp) => get(nestedProp, matchingVariations[nestedProp], source))
    .concat(isString(valueVariations.$all) ? valueVariations.$all : null)
    .filter((v) => !isNil(v))
    .join(" ");
}

function classnames(variations: Variations, ...inputs: Array<Source | null | undefined>): string {
  const sources = inputs.filter((source) => !isNil(source)) as Source[];

  const vars = Object.keys(variations).map((prop) => {
    // if (prop === $all) return variations[$all];
    if (prop === $all && (isString(variations[$all]) || isNil(variations[$all]))) return variations[$all];

    const variation = variations[prop];
    if (isNil(variation)) return null;

    return sources.map((source) => get(prop, variation, source)).filter((v) => !isNil(v));
  });

  const extras = sources.map((source) => source.className);

  return [...vars, ...extras].filter((s) => !isNil(s) && s.length > 0).join(" ");
}

export default classnames;
