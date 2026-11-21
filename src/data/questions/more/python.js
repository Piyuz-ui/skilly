// Extra Python questions (appended after the original 16 per level, so IDs
// continue at py-easy-17 …). Same row format as ../python.js.
export const easy = [
  ['strings', 'What does this print?', 'print("Skilly".upper()[1:4])', ['KIL', 'kil', 'SKI', 'KILL'], 'upper() gives "SKILLY"; the slice [1:4] takes indexes 1, 2 and 3.'],
  ['collections', 'What does this print?', 'a = [1, 2, 3]\na.append([4, 5])\nprint(len(a))', ['4', '5', '3', 'TypeError'], 'append adds the whole list as one element; extend would add 4 and 5 separately.'],
  ['basics', 'What does this print?', 'print(7 // 2, 7 % 2)', ['3 1', '3.5 1', '3 0.5', '4 1'], '// is floor division (3) and % is the remainder (1).'],
  ['control', 'What does this print?', 'x = 5\nprint("big" if x > 3 else "small")', ['big', 'small', 'True', 'SyntaxError'], 'A conditional expression picks the first value when the condition is true.'],
  ['collections', 'What does this print?', 'd = {"a": 1}\nd["b"] = 2\nprint(list(d.keys()))', ["['a', 'b']", "['b', 'a']", "{'a', 'b'}", '[1, 2]'], 'Assigning to a new key adds it; dictionaries keep insertion order.'],
  ['strings', 'What does this print?', 'print("a,b,,c".split(","))', ["['a', 'b', '', 'c']", "['a', 'b', 'c']", "['a,b,,c']", "['a', 'b', None, 'c']"], 'split keeps an empty string between two commas next to each other.'],
  ['functions', 'What does this print?', 'def add(a, b=10):\n    return a + b\n\nprint(add(5), add(5, 1))', ['15 6', '6 15', '15 15', 'TypeError'], 'The default b=10 is used only when b is not passed.'],
  ['basics', 'What does this print?', 'print(bool(""), bool("0"))', ['False True', 'False False', 'True True', 'True False'], 'An empty string is falsy; any non-empty string, even "0", is truthy.'],
];

export const medium = [
  ['collections', 'What does this print?', 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)', ['[1, 2, 3, 4]', '[1, 2, 3]', '[4]', 'None'], 'b = a makes both names point to the same list, so changes through b show in a.'],
  ['functions', 'What does this print?', 'def f(x, items=[]):\n    items.append(x)\n    return items\n\nf(1)\nprint(f(2))', ['[1, 2]', '[2]', '[1]', '[]'], 'A mutable default value is created once and shared between calls. Use items=None instead.'],
  ['iterators', 'What does this print?', 'print([x * x for x in range(5) if x % 2 == 0])', ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'], 'Only even x (0, 2, 4) pass the filter, then each is squared.'],
  ['strings', 'What does this print?', 'print(sorted(["banana", "Apple", "cherry"]))', ["['Apple', 'banana', 'cherry']", "['banana', 'cherry', 'Apple']", "['Apple', 'cherry', 'banana']", "['apple', 'banana', 'cherry']"], 'Strings sort by character code, and uppercase letters come before lowercase.'],
  ['errors', 'What does this print?', 'try:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print("div")\nfinally:\n    print("done")', ['div then done', 'done only', 'div only', 'It crashes with ZeroDivisionError'], 'The except block handles the error, and finally always runs afterwards.'],
  ['oop', 'What does this print?', 'class A:\n    count = 0\n    def __init__(self):\n        A.count += 1\n\nA()\nA()\nprint(A.count)', ['2', '0', '1', 'AttributeError'], 'count is a class attribute shared by all instances; each __init__ adds 1.'],
  ['collections', 'What does this print?', 'print({1, 2, 3} & {2, 3, 4})', ['{2, 3}', '{1, 2, 3, 4}', '{1, 4}', '[2, 3]'], '& on sets is intersection: items in both sets.'],
  ['strings', 'What does this print?', 's = "hello"\nprint(s[::-1][:2])', ['ol', 'he', 'lo', 'oh'], '[::-1] reverses to "olleh"; [:2] takes the first two characters.'],
];

export const hard = [
  ['iterators', 'What does this print?', 'g = (x for x in range(3))\nprint(list(g), list(g))', ['[0, 1, 2] []', '[0, 1, 2] [0, 1, 2]', '[] []', 'TypeError'], 'A generator can be consumed only once; the second list() finds it exhausted.'],
  ['functions', 'What does this print?', 'def outer():\n    x = 1\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\nf = outer()\nf()\nprint(f())', ['3', '2', '1', 'UnboundLocalError'], 'nonlocal lets inner change outer’s x, and the closure keeps x between calls: 2, then 3.'],
  ['oop', 'What does this print?', 'class P:\n    def __init__(self):\n        self._v = 1\n\n    @property\n    def v(self):\n        return self._v * 10\n\nprint(P().v)', ['10', '1', 'a bound method object', 'TypeError: v() missing argument'], '@property makes v read like an attribute, so no parentheses are needed.'],
  ['basics', 'What does this print?', 'print(0.1 + 0.2 == 0.3)', ['False', 'True', '0.3', 'TypeError'], 'Binary floating point cannot represent 0.1 and 0.2 exactly. Compare with math.isclose instead.'],
  ['collections', 'What does this print?', 'from collections import Counter\nprint(Counter("banana").most_common(1))', ["[('a', 3)]", "[('n', 2)]", "('a', 3)", "{'a': 3}"], 'most_common(n) returns a list of the n most frequent (item, count) pairs.'],
  ['iterators', 'What does this print?', 'print(list(zip([1, 2, 3], "ab")))', ["[(1, 'a'), (2, 'b')]", "[(1, 'a'), (2, 'b'), (3, None)]", "[1, 'a', 2, 'b']", 'ValueError'], 'zip stops at the shortest input.'],
  ['errors', 'What does this print?', 'def f():\n    try:\n        return "try"\n    finally:\n        return "finally"\n\nprint(f())', ['finally', 'try', 'try then finally', 'None'], 'A return inside finally overrides the earlier return. Avoid returning from finally.'],
  ['functions', 'What does this print?', 'print(*map(lambda x: x * 2, [1, 2]), sep="-")', ['2-4', '[2, 4]', '2 4', '<map object>'], '* unpacks the map into separate arguments, and sep joins them with "-".'],
];
