/* eslint-disable @typescript-eslint/ban-types */

type OmitType<T, P> = {
  [k in keyof T as T[k] extends P ? never : k]: T[k];
};

type Truthy = boolean | object | Function;

type Index = string | symbol | number;

type AsBooleanVariant<P> = { true: P } | { false: P } | string;

type $Hooks1<T> = T & { $all: string; $always: string; $forward: string };

type $Hooks2 = { $none: string; $nil: string; $notnil: string };

export type VariantsOf<T, P = $Hooks1<OmitType<Required<T>, Function>>> = {
  [k in keyof P]?: P[k] extends Index
    ?
        | {
            [i in P[k] | keyof $Hooks2]?: VariantsOf<$Hooks1<Omit<P, k>>> | string;
          }
        | string
    : P[k] extends Truthy
    ? AsBooleanVariant<string | VariantsOf<$Hooks1<Omit<P, k>>>>
    : never;
};
