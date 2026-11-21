// Extra Swift questions (IDs continue at swift-easy-17 …).
export const easy = [
  ['basics', 'What does this print?', 'let a = 7\nlet b = 2\nprint(a / b, a % b)', ['3 1', '3.5 1', '3 0', '4 1'], 'Integer division truncates; % gives the remainder.'],
  ['collections', 'What does this print?', 'var nums = [1, 2, 3]\nnums.append(4)\nprint(nums.count)', ['4', '3', '5', 'Compile error'], 'var arrays can grow; append adds one item.'],
  ['optionals', 'What does this print?', 'let name: String? = nil\nprint(name ?? "Guest")', ['Guest', 'nil', 'Optional(nil)', 'Crash'], '?? supplies a default when the optional is nil.'],
  ['control', 'What does this print?', 'for i in 1...3 {\n  print(i, terminator: " ")\n}', ['1 2 3', '1 2', '0 1 2', '1 2 3 4'], '1...3 is a closed range including both ends.'],
  ['basics', 'What does this print?', 'let s = "Hello"\nprint(s.count)', ['5', '4', '6', '"Hello"'], 'count gives the number of characters.'],
  ['collections', 'What does this print?', 'let d = ["a": 1]\nprint(d["b"] == nil)', ['true', 'false', '0', 'Crash'], 'Looking up a missing key returns nil instead of crashing.'],
  ['control', 'What does this print?', 'let x = 5\nprint(x > 3 ? "big" : "small")', ['big', 'small', 'true', 'Compile error'], 'The ternary operator picks "big".'],
  ['basics', 'What does this print?', 'var total = 0\nfor n in [1, 2, 3] {\n  total += n\n}\nprint(total)', ['6', '3', '123', '0'], 'The loop adds 1 + 2 + 3.'],
];

export const medium = [
  ['optionals', 'What does this print?', 'let input = "42"\nif let n = Int(input) {\n  print(n + 1)\n} else {\n  print("bad")\n}', ['43', '421', 'bad', 'Optional(43)'], 'Int("42") succeeds, so if let unwraps it to 42.'],
  ['collections', 'What does this print?', 'print([3, 1, 2].sorted())', ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', '123'], 'sorted() returns a new array in ascending order.'],
  ['types', 'What does this print?', 'struct P { var x: Int }\nvar a = P(x: 1)\nvar b = a\nb.x = 2\nprint(a.x)', ['1', '2', 'nil', 'Compile error'], 'Structs are value types: b is an independent copy.'],
  ['types', 'What does this print?', 'class C { var x = 1 }\nlet a = C()\nlet b = a\nb.x = 2\nprint(a.x)', ['2', '1', 'Compile error: b is let', 'nil'], 'Classes are reference types: a and b point to the same object.'],
  ['collections', 'What does this print?', 'print([1, 2, 3, 4].filter { $0 % 2 == 0 }.map { $0 * 10 })', ['[20, 40]', '[10, 30]', '[2, 4]', '[10, 20, 30, 40]'], 'filter keeps 2 and 4, then map multiplies each by 10.'],
  ['control', 'What does this print?', 'let n = 3\nswitch n {\ncase 1...2: print("low")\ncase 3...5: print("mid")\ndefault: print("high")\n}', ['mid', 'low', 'high', 'mid then high'], 'Swift switch cases do not fall through; 3 matches 3...5.'],
  ['optionals', 'What does this print?', 'let s: String? = "hi"\nprint(s?.uppercased() ?? "none")', ['HI', 'Optional("HI")', 'hi', 'none'], 'Optional chaining calls uppercased() because s is not nil.'],
  ['protocols', 'What is a protocol in Swift?', null, ['A blueprint of methods and properties that types conform to', 'A network request', 'A class that cannot be subclassed', 'A type of closure'], 'Protocols define requirements; structs, classes and enums can conform to them.'],
];

export const hard = [
  ['errors', 'What does this print?', 'enum E: Error { case bad }\nfunc f() throws -> Int { throw E.bad }\nlet r = try? f()\nprint(r == nil)', ['true', 'false', 'bad', 'It crashes'], 'try? turns a thrown error into nil.'],
  ['protocols', 'What does this print?', 'protocol Named { var name: String { get } }\nextension Named {\n  func hello() -> String { "Hi \\(name)" }\n}\nstruct U: Named { let name = "Riya" }\nprint(U().hello())', ['Hi Riya', 'Hi name', 'Hi \\(name)', 'Compile error'], 'A protocol extension gives every conforming type a default hello().'],
  ['collections', 'What does this print?', 'print([1, 2, 3].reduce(0, +))', ['6', '0', '123', '[1, 2, 3]'], 'reduce starts at 0 and adds each element.'],
  ['types', 'What does this print?', 'enum Dir { case up, down }\nlet d = Dir.up\nswitch d {\ncase .up: print("U")\ncase .down: print("D")\n}', ['U', 'D', 'up', 'Compile error'], 'The switch matches the .up case; switching on an enum must be exhaustive.'],
  ['control', 'What does this print?', 'func f() {\n  defer { print("1") }\n  defer { print("2") }\n  print("3")\n}\nf()', ['3 then 2 then 1', '1 then 2 then 3', '3 then 1 then 2', '2 then 1 then 3'], 'defer blocks run when the scope exits, in reverse order.'],
  ['optionals', 'What does this print?', 'let a: Int? = 5\nguard let v = a else { fatalError("missing") }\nprint(v * 2)', ['10', 'Optional(10)', 'missing', '5'], 'guard let unwraps a; afterwards v is a plain Int.'],
  ['concurrency', 'What does marking a function async allow?', null, ['It can suspend at await without blocking the thread', 'It always runs on a background thread', 'It returns immediately with nil', 'It can no longer throw'], 'async functions may pause at await points; the thread is freed for other work meanwhile.'],
  ['types', 'What does this print?', 'var a = [1, 2]\nvar b = a\nb.append(3)\nprint(a.count)', ['2', '3', '1', 'Compile error'], 'Swift arrays are value types (copy-on-write), so a keeps 2 items.'],
];
