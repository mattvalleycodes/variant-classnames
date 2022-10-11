/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */

import isNil from "./is-nil";
import isString from "./is-string";
import isBoolean from "./is-boolean";

type MaybeString = string | null | undefined | boolean;

type HookTypes = "$all" | "$always" | "$none" | "$nil" | "$notnil";

type Hooks = {
  [key in HookTypes]?: MaybeString | Variations;
};

type HooksWithForward = Hooks & {
  $forward?: MaybeString;
};

export type Variations = Hooks & {
  [key: string]: MaybeString | Variations;
};

export type RootVariations = HooksWithForward & Variations;

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
const $notnil = "$notnil";
const $forward = "$forward";

/**
 * check if prop is directive $always
 * @deprated must remove after completing deprecation of $all directive
 */
const isAlways = (prop: string): boolean => prop === $all || prop === $always;

/**
 * get the value from directive $always or always
 * @deprated must remove after completing deprecation of $all directive
 */
const getAlwaysVariation = (variations?: Variations): MaybeString | Variations =>
  variations?.[$always] || variations?.[$all];

export function get(
  prop: string,
  valueVariations: Variations | MaybeString,
  source: Source,
): Exclude<MaybeString, boolean> {
  let correspondingSourceValue = source[prop];

  // for the provided prop, there is no variation, we should not continue
  if (isNil(valueVariations)) return null;

  if (isBoolean(valueVariations)) return valueVariations.toString();

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
    if (Boolean(correspondingSourceValue) === true) {
      return valueVariations;
    }

    // prop -> css class and prop value is not true, this is no match so we should return nothing
    return null;
  }

  // when prop has no value, we pretent value is $nil to be able to kick off $nil hook later.
  if (isNil(correspondingSourceValue)) {
    correspondingSourceValue = $nil;
  }

  // at this stage we're dealing with prop -> a range of variations (this is an object)
  // we need to resolve the variation that match current value of the prop
  // if value of the prop doesn't have a match, we should divert to $none hook here.
  let matchingVariations = valueVariations[correspondingSourceValue.toString()] || valueVariations[$none];

  // when $notnil was provided and prop value is not nil we append $nonil value to matching variations
  // have to filter undefined in case there were no matches
  if (!isNil(valueVariations[$notnil]) && !isNil(correspondingSourceValue)) {
    matchingVariations = [valueVariations[$notnil], matchingVariations].filter(Boolean).join(" ");
  }

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
        .map((nestedProp) => get(nestedProp, (alwaysVar as any)[nestedProp], source))
        .filter((v) => !isNil(v))
        .join(" ");
    }

    // prop value (or $none) maps to string, if we don't have $always just return what we got
    if (isNil(alwaysVar)) {
      return matchingVariations;
    }

    // prop value (or $none) maps to string, we also got the $always hook, combine and return
    return `${alwaysVar} ${matchingVariations}`;
  }

  return Object.keys(matchingVariations)
    .map((nestedProp) => get(nestedProp, (matchingVariations as any)?.[nestedProp], source))
    .concat(isString(alwaysVar) ? alwaysVar : null)
    .filter((v) => !isNil(v))
    .join(" ");
}

/**
 * @private
 * @description function `forward` computes the CSS classes that should
 * be included in final list of CSS classes.
 *
 * @param variations
 * @param source
 */
function forward($forwardValue: MaybeString, source: Source): string {
  if ($forwardValue === false) {
    return "";
  }

  /**
   * `toForward` defines value of what fields should be extracted, combined
   * and returned as the list of CSS classes to be included as `extras`.
   * We're defaulting to `["className", "class"]` to keep the code backward
   * compatible.
   * When `$forward=true` is provided, it means that we should forward the
   * default props including: `className`, and `class`.
   */

  const fields =
    isNil($forwardValue) || $forwardValue === true
      ? ["className", "class"]
      : $forwardValue.split(",").map((v) => v.trim());

  return fields
    .map((fieldName): string => {
      const value = source[fieldName];
      if (isNil(value)) return "";
      if (isString(value)) return value.trim();

      return String(value).trim();
    })
    .filter((v) => v.length)
    .join(" ");
}

function classnames(_variations: unknown, ...inputs: Array<Source | null | undefined>): string {
  const variations = _variations as RootVariations;
  const sources = inputs.filter((source) => !isNil(source)) as Source[];

  const vars = Object.keys(variations)
    .filter((v) => v !== $forward)
    .map((prop) => {
      if (isAlways(prop)) {
        const allV = getAlwaysVariation(variations);

        if (isNil(allV)) return "";
        if (isBoolean(allV)) return allV.toString();
        if (isString(allV)) return allV;
      }

      const variation = variations[prop];
      if (isNil(variation)) return null;

      return sources.map((source) => get(prop, variation, source)).filter((v) => !isNil(v));
    });

  const extras = sources.map((source) => forward(variations.$forward, source));

  return [...vars, ...extras].filter((s) => !isNil(s) && s.length > 0).join(" ");
}

export function classnamesWithScope<T extends Record<string, any>>(
  scope: T,
  input: Source | null | undefined,
): Record<keyof T, string> {
  return Object.entries(scope).reduce(
    (acc, [key, variants]) => ({
      ...acc,
      [key]: classnames(variants, input),
    }),
    {} as Record<keyof T, string>,
  );
}

export { classnames as vc, classnamesWithScope as vcs };

export default classnames;
