// Extra JavaScript questions (IDs continue at js-easy-17 …).
export const easy = [
  ['coercion', 'What does this print?', 'console.log("5" + 3);', ['53', '8', 'NaN', 'TypeError'], 'With a string involved, + concatenates: "5" + "3".'],
  ['coercion', 'What does this print?', 'console.log("5" - 3);', ['2', '53', 'NaN', '"2"'], '- only works on numbers, so "5" is converted to 5.'],
  ['arrays', 'What does this print?', 'console.log([1, 2, 3].map(x => x * 2).join(","));', ['2,4,6', '1,2,3', '[2, 4, 6]', '6'], 'map doubles each item and join makes one string.'],
  ['basics', 'What does this print?', 'let a = 10;\na += 5;\nconsole.log(a);', ['15', '105', '10', '5'], 'a += 5 is short for a = a + 5.'],
  ['objects', 'What does this print?', 'const o = { x: 1 };\no.y = 2;\nconsole.log(Object.keys(o).length);', ['2', '1', 'TypeError: o is const', 'undefined'], 'const stops reassigning o, not changing its properties.'],
  ['control', 'What does this print?', 'for (let i = 0; i < 3; i++) {\n  if (i === 1) continue;\n  console.log(i);\n}', ['0 then 2', '0 1 2', '1', '0'], 'continue skips the rest of that loop pass, so 1 is not printed.'],
  ['functions', 'What does this print?', 'const greet = (name = "friend") => `Hi ${name}`;\nconsole.log(greet());', ['Hi friend', 'Hi undefined', 'Hi ${name}', 'Hi '], 'The default parameter is used when no argument is passed.'],
  ['arrays', 'What does this print?', 'console.log([3, 1, 2].includes(2));', ['true', 'false', '2', '-1'], 'includes returns a boolean saying whether the value is in the array.'],
];

export const medium = [
  ['coercion', 'What does this print?', 'console.log(typeof NaN);', ['number', 'NaN', 'undefined', 'object'], 'NaN ("not a number") is still of type number.'],
  ['arrays', 'What does this print?', 'console.log([10, 1, 3].sort().join(","));', ['1,10,3', '1,3,10', '10,3,1', '3,1,10'], 'Without a compare function, sort compares items as strings. Use sort((a, b) => a - b) for numbers.'],
  ['objects', 'What does this print?', 'const a = { n: 1 };\nconst b = { ...a };\nb.n = 2;\nconsole.log(a.n);', ['1', '2', 'undefined', 'TypeError'], 'Spreading makes a new (shallow) copy, so changing b does not affect a.'],
  ['functions', 'What does this print?', 'function makeCounter() {\n  let c = 0;\n  return () => ++c;\n}\nconst next = makeCounter();\nnext();\nconsole.log(next());', ['2', '1', '0', 'NaN'], 'The returned function keeps access to c (a closure); each call adds 1.'],
  ['async', 'In what order are the letters printed?', 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");', ['A D C B', 'A B C D', 'A D B C', 'A C D B'], 'Synchronous code runs first (A, D), then promise callbacks (microtasks: C), then timers (B).'],
  ['objects', 'What does this print?', 'console.log(JSON.stringify({ a: undefined, b: 1 }));', ['{"b":1}', '{"a":undefined,"b":1}', '{"a":null,"b":1}', '{}'], 'JSON.stringify leaves out properties whose value is undefined.'],
  ['coercion', 'What does this print?', 'console.log(0 == "", 0 === "");', ['true false', 'false false', 'true true', 'false true'], '== converts "" to 0 before comparing; === compares type too.'],
  ['arrays', 'What does this print?', 'const arr = [1, 2, 3, 4];\nconsole.log(arr.filter(n => n % 2).reduce((s, n) => s + n, 0));', ['4', '10', '6', '2'], 'filter keeps odd numbers (1 and 3) and reduce adds them.'],
];

export const hard = [
  ['basics', 'What does this print?', 'console.log(typeof x);\nvar x = 1;', ['undefined', 'number', 'ReferenceError', 'null'], 'var declarations are hoisted and start as undefined until the assignment line runs.'],
  ['control', 'What does this print?', 'try {\n  console.log(y);\n  let y = 1;\n} catch (e) {\n  console.log(e.name);\n}', ['ReferenceError', 'undefined', '1', 'TypeError'], 'let variables are in a "temporal dead zone" until declared; reading them early throws ReferenceError.'],
  ['async', 'What does this print?', 'async function f() {\n  return 1;\n}\nconsole.log(f() instanceof Promise);', ['true', 'false', '1', 'undefined'], 'An async function always returns a Promise, even when it returns a plain value.'],
  ['arrays', 'What does this print?', 'console.log([1, 2, 3].indexOf("2"));', ['-1', '1', '2', 'NaN'], 'indexOf uses strict equality, and the string "2" is not the number 2.'],
  ['objects', 'What does this print?', 'const s = new Set([1, 1, 2]);\nconsole.log(s.size);', ['2', '3', '1', 'undefined'], 'A Set stores each value only once.'],
  ['functions', 'What does this print?', 'console.log([1, 2, 3].map(parseInt).join(","));', ['1,NaN,NaN', '1,2,3', 'NaN,NaN,NaN', '1,2,NaN'], 'map passes (value, index), so parseInt gets radix 0, 1 and 2: "2" in base 1 and "3" in base 2 are invalid.'],
  ['coercion', 'What does this print?', 'console.log(null ?? "x", 0 || "y", 0 ?? "z");', ['x y 0', 'x y z', 'null 0 0', 'x 0 z'], '?? only replaces null/undefined; || replaces any falsy value such as 0.'],
  ['async', 'What does this print?', 'Promise.allSettled([Promise.reject(new Error("no")), Promise.resolve(2)])\n  .then(r => console.log(r.map(x => x.status).join(",")));', ['rejected,fulfilled', 'fulfilled,fulfilled', 'Error: no', 'rejected'], 'allSettled waits for every promise and reports each status instead of failing fast.'],
];
