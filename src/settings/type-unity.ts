export type Debug<T> = { [P in keyof T]: T[P] };
// type A = Debug<{ a: 1 } & { b : 2 }> // Expect: { a: 1, b: 2 }

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;
// type B = Equal<string, string> // Expect true

export type ReadyOnly<T> = { readonly [P in keyof T]: T[P] };
// type A = ReadyOnly<{ a: 1 }> // Expect: { readonly a: 1 }

export type Merge<T> = T extends object ? { [K in keyof T]: Merge<T[K]> } : T;
// type A = Merge<{ a: { b: { c: 1 } } }> // Expect: { a: { b: { c: 1 } } }

export type Union<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
// type A = Union<{ a: 1 } | { b: 2 }> // Expect: { a: 1, b: 2 }

export type ExpectValidArgs<
  FUNC extends (...args: any[]) => any,
  ARGS extends any[],
> = ARGS extends Parameters<FUNC> ? true : false;
// type A = ExpectValidArgs<(a: string, b: number) => void, [string, number]> // Expect true
