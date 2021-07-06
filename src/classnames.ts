import isNil from "./is-nil";
import isString from "./is-string";

type MaybeString = string | null | undefined;

type Variations = {
  $all?: string;
  $none?: string;
  $nil?: string;

  [key: string]: MaybeString | Variations;
};

type Source = {
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

  if (isNil(valueVariations)) return null;

  if (prop === $all && isString(valueVariations)) {
    return valueVariations;
  }

  if (isString(valueVariations)) {
    if (correspondingSourceValue === true) return valueVariations;

    return null;
  }

  if (isNil(correspondingSourceValue)) correspondingSourceValue = $nil;

  const matchingVariations = valueVariations[correspondingSourceValue.toString()] || valueVariations[$none];

  if (isNil(matchingVariations) || isString(matchingVariations)) {
    if (isNil(matchingVariations)) return valueVariations[$all];
    if (isNil(valueVariations.$all)) return matchingVariations;
    return `${valueVariations.$all} ${matchingVariations}`;
  }

  return Object.keys(matchingVariations)
    .map((nestedProp) => get(nestedProp, matchingVariations[nestedProp], source))
    .concat(valueVariations.$all)
    .filter((v) => !isNil(v))
    .join(" ");
}

function classnames(variations: Variations, ...inputs: Array<Source | null | undefined>): string {
  const sources = inputs.filter((source) => !isNil(source)) as Source[];

  const vars = Object.keys(variations).map((prop) => {
    if (prop === $all) return variations[$all];

    const variation = variations[prop];
    if (isNil(variation)) return null;

    return sources.map((source) => get(prop, variation, source)).filter((v) => !isNil(v));
  });

  const extras = sources.map((source) => source.className);

  return [...vars, ...extras].filter((s) => !isNil(s) && s.length > 0).join(" ");
}

export default classnames;
