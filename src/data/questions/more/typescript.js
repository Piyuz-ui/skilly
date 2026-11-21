// Extra TypeScript questions (IDs continue at ts-easy-17 …).
export const easy = [
  ['basics', 'What does this print?', 'let n: number = 5;\nn = n * 2;\nconsole.log(n);', ['10', '5', '52', 'Type error'], 'Type annotations do not change runtime behaviour; n becomes 10.'],
  ['basics', 'What does this print?', 'const names: string[] = ["a", "b"];\nconsole.log(names.length);', ['2', '1', 'string[]', 'undefined'], 'string[] is an array of strings; length is 2.'],
  ['functions', 'What does this print?', 'function add(a: number, b: number): number {\n  return a + b;\n}\nconsole.log(add(2, 3));', ['5', '23', 'NaN', 'number'], 'The parameters and return value are typed as numbers.'],
  ['objects', 'What does this print?', 'interface User {\n  name: string;\n  age?: number;\n}\nconst u: User = { name: "Riya" };\nconsole.log(u.age);', ['undefined', '0', 'null', 'Compile error: age is missing'], 'The ? makes age optional, so leaving it out is allowed and it is undefined.'],
  ['basics', 'Which type accepts any value but makes you check it before using it?', null, ['unknown', 'any', 'never', 'void'], 'unknown is the safe version of any: you must narrow it (typeof, instanceof…) before use.'],
  ['tooling', 'Which file configures the TypeScript compiler for a project?', null, ['tsconfig.json', 'package.json', 'typescript.config.js', '.tsrc'], 'tsconfig.json holds options like strict, target and the files to include.'],
  ['narrowing', 'What does this print?', 'function len(x: string | number): number {\n  return typeof x === "string" ? x.length : x;\n}\nconsole.log(len("abc") + len(4));', ['7', '"abc4"', '3', 'NaN'], 'typeof narrows the union: "abc" gives 3, the number 4 is returned as is.'],
  ['objects', 'What does this print?', 'const point = { x: 1, y: 2 } as const;\nconsole.log(Object.values(point).join("-"));', ['1-2', 'x-y', '[1, 2]', 'Compile error'], 'as const makes the object readonly with literal types; values are unchanged at runtime.'],
];

export const medium = [
  ['narrowing', 'What does this print?', 'type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };\nfunction area(sh: Shape): number {\n  return sh.kind === "circle" ? 3 * sh.r * sh.r : sh.s * sh.s;\n}\nconsole.log(area({ kind: "square", s: 4 }));', ['16', '48', '12', 'NaN'], 'Checking the kind field narrows the union to the square branch.'],
  ['generics', 'What does this print?', 'function first<T>(xs: T[]): T | undefined {\n  return xs[0];\n}\nconsole.log(first<number>([]));', ['undefined', '0', 'null', 'RangeError'], 'Reading past the end of an array gives undefined, which the return type allows.'],
  ['utility', 'What does Readonly<User> do?', null, ['Makes every property of User read-only', 'Makes every property optional', 'Freezes the object at runtime', 'Removes methods from User'], 'Readonly is checked by the compiler only; use Object.freeze for runtime protection.'],
  ['utility', "What does Pick<User, 'name'> produce?", null, ['A type with only the name property', 'A type with every property except name', 'The type of the name property', 'A runtime copy of user.name'], 'Pick keeps the listed keys; Omit removes them.'],
  ['functions', 'What does this print?', 'const nums: readonly number[] = [3, 1, 2];\nconsole.log([...nums].sort((a, b) => a - b).join(","));', ['1,2,3', '3,1,2', 'Compile error: nums is readonly', '3,2,1'], 'Copying with spread gives a mutable array that can be sorted; nums itself stays unchanged.'],
  ['narrowing', 'Inside if (x !== null) { … }, where x: string | null, what is the type of x?', null, ['string', 'string | null', 'null', 'unknown'], 'The check removes null from the union inside the block.'],
  ['objects', 'What does this print?', 'const scores: Record<string, number> = { a: 1 };\nscores["b"] = 2;\nconsole.log(Object.keys(scores).join(","));', ['a,b', 'a', 'b,a', 'Compile error'], 'Record<string, number> allows any string key with a number value.'],
  ['tooling', 'Are TypeScript types checked while the program runs?', null, ['No: types are erased when compiled to JavaScript', 'Yes: every assignment is checked at runtime', 'Only in strict mode', 'Only for interfaces'], 'Types exist only at compile time; use runtime validation (e.g. zod) for untrusted data.'],
];

export const hard = [
  ['advanced', 'What is keyof { a: number; b: string }?', null, ['"a" | "b"', 'number | string', 'string', '["a", "b"]'], 'keyof gives a union of the property names.'],
  ['utility', 'What is ReturnType<() => Promise<number>>?', null, ['Promise<number>', 'number', 'void', '() => number'], 'ReturnType gives exactly what the function returns: here, a Promise of number.'],
  ['generics', 'type ElementType<T> = T extends (infer U)[] ? U : never; what is ElementType<string[]>?', null, ['string', 'string[]', 'never', 'unknown'], 'infer U captures the array element type when the condition matches.'],
  ['narrowing', 'In a switch over a union, why assign the leftover value to a variable of type never?', null, ['The compiler errors if a case is missing', 'It makes the switch faster', 'It removes the default case', 'It converts the value to null'], 'If every member is handled, the leftover is never; adding a new member makes the assignment fail to compile.'],
  ['advanced', 'What does the satisfies operator do?', null, ['Checks a value matches a type without widening its inferred type', 'Casts a value to any type', 'Throws at runtime if the type is wrong', 'Declares a new interface'], 'value satisfies T validates against T but keeps the more specific inferred type.'],
  ['utility', 'What is Awaited<Promise<Promise<string>>>?', null, ['string', 'Promise<string>', 'Promise<Promise<string>>', 'unknown'], 'Awaited unwraps promises recursively, like await does.'],
  ['generics', 'What does this print?', 'const map = new Map<string, number>([["a", 1]]);\nmap.set("a", map.get("a")! + 1);\nconsole.log(map.get("a"));', ['2', '1', '"11"', 'undefined'], 'The ! (non-null assertion) tells TypeScript the value exists; at runtime it is just 1 + 1.'],
  ['advanced', "What is the type `${'a' | 'b'}-x`?", null, ['"a-x" | "b-x"', 'string', '"ab-x"', '"a" | "b" | "x"'], 'Template literal types distribute over unions.'],
];
