import isNil from "./is-nil";
import isString from "./is-string";

type MaybeString = string | null | undefined;

export type Variations = {
  /** @deprecated·use·$always·instead */
  $all?: MaybeString | Variations;
  $always?: MaybeString | Variations;
  $none?: MaybeString | Variations;
  $nil?: MaybeString | Variations;
  [key: string]: MaybeString | Variations;
};

export type Source = {
  className?: MaybeString;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/** @deprecated·replaced by $always */
const $all = "$all";
const $always = "$always";
const $none = "$none";
const $nil = "$nil";

/**
 * check if prop is directive $always
 * @deprated must remove after completing deprecation of $all directive
 */
const isAlways = (prop: string): boolean => prop === $all || prop === $always;

/**
 * get the value from directive $always or always
 * @deprated must remove after completing deprecation of $all directive
 */
const getAlwaysVariation = (variations: Variations | string | null | undefined): MaybeString | Variations =>
  variations?.[$always] || variations?.[$all];

export function get(
  prop: string,
  valueVariations: Variations | string | null | undefined,
  source: Source,
): MaybeString {
  let correspondingSourceValue = source[prop];

  // for the provided prop, there is no variation, we should not continue
  if (isNil(valueVariations)) return null;

  // this is a $always hook and if it is set to actual CSS classes (string), we should return value here.
  if (isAlways(prop)) {
    if (isString(valueVariations) || isNil(valueVariations)) return valueVariations;

    return Object.keys(valueVariations)
      .map((nestedProp) => get(nestedProp, valueVariations[nestedProp], source))
      .filter((v) => !isNil(v))
      .join(" ");
  }

  // there is no further variatios to inspect, we're dealing with props -> css class case here
  // we need to finish the execution at this point
  if (isString(valueVariations)) {
    // prop -> css class basically means include classes when prop value is `truthy`
    if (Boolean(correspondingSourceValue) === true) return valueVariations;

    // prop -> css class and prop value is not true, this is no match so we should return nothing
    return null;
  }

  // when prop has no value, we pretent value is $nil to be able to kick off $nil hook later.
  if (isNil(correspondingSourceValue)) correspondingSourceValue = $nil;

  // at this stage we're dealing with prop -> a range of variations (this is an object)
  // we need to resolve the variation that match current value of the prop
  // if value of the prop doesn't have a match, we should divert to $none hook here.
  const matchingVariations = valueVariations[correspondingSourceValue.toString()] || valueVariations[$none];

  const alwaysVar = getAlwaysVariation(valueVariations);

  // this means we're either prop -> null / string so we don't need to dig more
  if (isNil(matchingVariations) || isString(matchingVariations)) {
    // prop value (or $none) doesn't map to any variation
    // return value of $always hook, when it's available.
    if (isNil(matchingVariations)) {
      // if $always hook maps to string/null, just return it. no need to dig more
      if (isString(alwaysVar) || isNil(alwaysVar)) return alwaysVar;

      // $always maps to an object we should dig more
      return Object.keys(alwaysVar)
        .map((nestedProp) => get(nestedProp, alwaysVar[nestedProp], source))
        .filter((v) => !isNil(v))
        .join(" ");
    }

    // prop value (or $none) maps to string, if we don't have $always just return what we got
    if (isNil(alwaysVar)) return matchingVariations;

    // prop value (or $none) maps to string, we also got the $always hook, combine and return
    return `${alwaysVar} ${matchingVariations}`;
  }

  return Object.keys(matchingVariations)
    .map((nestedProp) => get(nestedProp, matchingVariations[nestedProp], source))
    .concat(isString(alwaysVar) ? alwaysVar : null)
    .filter((v) => !isNil(v))
    .join(" ");
}

function classnames(variations: Variations, ...inputs: Array<Source | null | undefined>): string {
  const sources = inputs.filter((source) => !isNil(source)) as Source[];

  const alwaysVar = getAlwaysVariation(variations);

  const vars = Object.keys(variations).map((prop) => {
    if (isAlways(prop) && (isString(alwaysVar) || isNil(alwaysVar))) {
      return alwaysVar;
    }

    const variation = variations[prop];

    if (isNil(variation)) {
      return null;
    }

    return sources.map((source) => get(prop, variation, source)).filter((v) => !isNil(v));
  });

  const extras = sources.map((source) => source.className);

  return [...vars, ...extras].filter((s) => !isNil(s) && s.length > 0).join(" ");
}

export default classnames;
