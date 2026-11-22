// Python question bank.
// Row format: [topic, prompt, code|null, [correct, wrong, wrong, wrong], explanation]
// Option 0 is always the correct answer in source; the test engine shuffles
// options once per attempt and stores that order. IDs are derived from
// position (py-easy-01 …) so only APPEND new rows to keep IDs stable.

import { META } from './meta.js';

export const meta = META.python;

export const easy = [
  ['basics', 'What does this print?', 'print(type(3 / 2))', ["<class 'float'>", "<class 'int'>", "<class 'decimal'>", 'It raises a TypeError'], 'The / operator always performs true division in Python 3 and returns a float (1.5).'],
  ['collections', 'What does this print?', 'nums = [10, 20, 30, 40]\nprint(nums[-1])', ['40', '10', '30', 'IndexError'], 'Negative indexes count from the end, so -1 is the last element.'],
  ['collections', 'What does this slice return?', 'print([1, 2, 3, 4, 5][1:3])', ['[2, 3]', '[1, 2, 3]', '[2, 3, 4]', '[1, 2]'], 'Slices include the start index and stop before the end index: positions 1 and 2.'],
  ['strings', 'What is the value of the expression?', '"py" * 3', ["'pypypy'", "'py3'", "['py', 'py', 'py']", 'TypeError'], 'Multiplying a string by an integer repeats it.'],
  ['control', 'What does this loop print?', "for i in range(3):\n    print(i, end=' ')", ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], 'range(3) produces 0, 1, 2 — it stops before 3.'],
  ['functions', 'What does f() return?', 'def f(x=2):\n    return x * x', ['4', '0', 'None', 'TypeError: missing argument'], 'When no argument is passed, the default value x=2 is used.'],
  ['collections', 'What does this print?', "d = {'a': 1}\nprint(d.get('b', 0))", ['0', 'None', 'KeyError', "'b'"], 'dict.get returns the supplied default when the key is missing instead of raising KeyError.'],
  ['basics', 'What is 7 // 2?', null, ['3', '3.5', '4', '3.0'], '// is floor division; with two ints it returns an int rounded down.'],
  ['strings', 'What does len("hello") return?', null, ['5', '4', '6', 'It depends on the encoding'], 'len counts the characters in a str: h, e, l, l, o.'],
  ['collections', 'Which of these built-in types is immutable?', null, ['tuple', 'list', 'dict', 'set'], 'Tuples cannot be changed after creation; lists, dicts and sets can.'],
  ['control', 'What does bool([]) evaluate to?', null, ['False', 'True', 'None', 'It raises a ValueError'], 'Empty containers are falsy in Python.'],
  ['errors', 'Which exception does int("abc") raise?', null, ['ValueError', 'TypeError', 'SyntaxError', 'KeyError'], 'The argument has the right type (str) but an invalid value for conversion, so ValueError is raised.'],
  ['basics', 'What is 10 % 3?', null, ['1', '3', '0', '3.33'], '% returns the remainder: 10 = 3 × 3 + 1.'],
  ['collections', 'What does this print?', 'print(len({1, 2, 2, 3}))', ['3', '4', '2', 'TypeError'], 'Sets store unique values, so the duplicate 2 is kept once.'],
  ['functions', 'What does a function return if it has no return statement?', null, ['None', '0', 'An empty string', 'It raises an error'], 'Functions implicitly return None.'],
  ['oop', 'What is __init__ used for in a class?', null, ['Initialising a new instance after it is created', 'Deleting an instance', 'Importing the class', 'Declaring class constants only'], '__init__ runs when you call the class, letting you set up the new object’s attributes.'],
];

export const medium = [
  ['collections', 'What does this print?', 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)', ['[1, 2, 3]', '[1, 2]', '[3]', 'NameError'], 'b = a copies the reference, not the list. Both names point at the same list object.'],
  ['functions', 'What does the last line print?', 'def add(x, items=[]):\n    items.append(x)\n    return items\n\nadd(1)\nprint(add(2))', ['[1, 2]', '[2]', '[1]', '[[1], 2]'], 'Default values are evaluated once at definition time, so the same list is reused between calls. Use items=None instead.'],
  ['iterators', 'What does this comprehension produce?', '[x * x for x in range(5) if x % 2 == 0]', ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'], 'It keeps even x (0, 2, 4) and squares them.'],
  ['collections', 'What happens when this runs?', "d = {'a': 1, 'b': 2}\nfor k in d:\n    if k == 'a':\n        d['c'] = 3", ['RuntimeError: dictionary changed size during iteration', "d becomes {'a': 1, 'b': 2, 'c': 3} silently", 'The loop runs forever', 'KeyError'], 'Adding keys while iterating a dict changes its size, which Python detects and reports. Iterate over list(d) instead.'],
  ['functions', 'What does this print?', 'fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])', ['[2, 2, 2]', '[0, 1, 2]', '[0, 0, 0]', 'NameError'], 'Closures look up i when called, not when created. By then the loop has finished with i = 2.'],
  ['strings', 'What does this return?', '"a,b,,c".split(",")', ["['a', 'b', '', 'c']", "['a', 'b', 'c']", "['a', 'b', None, 'c']", "['a,b,,c']"], 'Splitting on an explicit separator keeps empty strings between consecutive separators.'],
  ['errors', 'What is printed?', "try:\n    print('A')\nexcept Exception:\n    print('B')\nelse:\n    print('C')\nfinally:\n    print('D')", ['A C D', 'A D', 'A B D', 'A B C D'], 'No exception occurs, so except is skipped, else runs, and finally always runs.'],
  ['oop', 'What does this print?', 'class C:\n    items = []\n\nc1, c2 = C(), C()\nc1.items.append(1)\nprint(c2.items)', ['[1]', '[]', 'AttributeError', 'None'], 'items is a class attribute shared by all instances. Create per-instance lists in __init__.'],
  ['collections', 'What does sorted(["b", "A", "c"]) return?', null, ["['A', 'b', 'c']", "['b', 'A', 'c']", "['A', 'c', 'b']", "['c', 'b', 'A']"], 'Strings sort by code point; uppercase letters come before lowercase. Here A < b < c.'],
  ['functions', 'What does f(1, 2, 3) return?', 'def f(a, *rest):\n    return rest', ['(2, 3)', '[2, 3]', '(1, 2, 3)', '3'], '*rest collects extra positional arguments into a tuple.'],
  ['collections', 'What does a contain afterwards?', 'a = [[1], [2]]\nb = a.copy()\nb[0].append(9)', ['[[1, 9], [2]]', '[[1], [2]]', '[[1], [2], 9]', '[[9], [2]]'], 'list.copy() is shallow: the outer list is new but the inner lists are shared. Use copy.deepcopy for nested data.'],
  ['iterators', 'What does list(zip("abc", [1, 2])) return?', null, ["[('a', 1), ('b', 2)]", "[('a', 1), ('b', 2), ('c', None)]", 'ValueError', "['a1', 'b2']"], 'zip stops at the shortest input.'],
  ['control', 'What does this print?', "for n in [1, 3, 5]:\n    if n % 2 == 0:\n        break\nelse:\n    print('none even')", ['none even', 'Nothing', '1 3 5', 'SyntaxError'], 'A loop’s else block runs when the loop finishes without hitting break.'],
  ['basics', 'What does this print?', 'a = [1]\nb = [1]\nprint(a == b, a is b)', ['True False', 'True True', 'False False', 'False True'], '== compares values; is compares identity. These are two different list objects with equal contents.'],
  ['functions', 'What happens when f() is called?', 'x = 5\ndef f():\n    x += 1\n    return x', ['UnboundLocalError', 'Returns 6', 'Returns 5', 'x becomes 6 globally'], 'Assigning to x makes it local to f, so x += 1 reads a local that has no value yet. Use global or pass x in.'],
  ['oop', 'What does B().hi() return?', "class A:\n    def hi(self):\n        return 'A'\n\nclass B(A):\n    def hi(self):\n        return 'B' + super().hi()", ["'BA'", "'B'", "'AB'", 'RecursionError'], 'super().hi() calls the parent implementation, which returns A.'],
];

export const hard = [
  ['iterators', 'What is printed?', 'g = (x * 2 for x in range(3))\nprint(sum(g))\nprint(sum(g))', ['6 then 0', '6 then 6', '6 then an exception', '0 then 6'], 'A generator can be consumed only once. The second sum sees an exhausted generator.'],
  ['collections', 'What does grid look like?', 'grid = [[0] * 3] * 3\ngrid[0][0] = 1', ['[[1, 0, 0], [1, 0, 0], [1, 0, 0]]', '[[1, 0, 0], [0, 0, 0], [0, 0, 0]]', '[[1, 1, 1], [0, 0, 0], [0, 0, 0]]', 'TypeError'], 'Multiplying the outer list repeats the same inner list object three times. Build rows with a comprehension.'],
  ['iterators', 'What do the last two lines evaluate to?', 'def g():\n    x = yield 1\n    yield x * 2\n\nit = g()\nnext(it)\nit.send(5)', ['1, then 10', '1, then 2', '1, then None', 'TypeError on send'], 'next() runs to the first yield (1). send(5) resumes it, assigns x = 5 and runs to yield 10.'],
  ['oop', 'What is the MRO of D?', 'class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass', ['D, B, C, A, object', 'D, B, A, C, object', 'D, C, B, A, object', 'D, A, B, C, object'], 'C3 linearisation keeps the left-to-right base order and puts a shared base (A) after all its subclasses.'],
  ['oop', 'What happens on the last line?', "class P:\n    __slots__ = ('x',)\n\np = P()\np.x = 1\np.y = 2", ['AttributeError', 'p.y is stored in __dict__', 'p.y silently does nothing', 'TypeError at class definition'], 'With __slots__ and no __dict__, only declared attributes can be set.'],
  ['oop', 'A class defines __eq__ but not __hash__. What happens with {Point(1, 2)}?', null, ['TypeError: unhashable type', 'It works using identity hashing', 'It works using __eq__ as the hash', 'Only a warning is emitted'], 'Defining __eq__ sets __hash__ to None unless you define it too, so instances cannot go in sets or be dict keys.'],
  ['functions', 'What does this print?', 'fs = [lambda i=i: i for i in range(3)]\nprint([f() for f in fs])', ['[0, 1, 2]', '[2, 2, 2]', '[0, 0, 0]', 'TypeError'], 'Default arguments are evaluated when each lambda is created, capturing the current i.'],
  ['concurrency', 'In standard CPython builds with the GIL, which workload benefits most from threading?', null, ['Many network requests waiting on I/O', 'Pure-Python CPU-heavy number crunching', 'Tight loops doing integer math', 'Recursive Fibonacci'], 'The GIL lets only one thread run Python bytecode at a time, but it is released while waiting on I/O. Use multiprocessing for CPU-bound work.'],
  ['errors', 'What does f() return?', 'def f():\n    try:\n        return 1\n    finally:\n        return 2', ['2', '1', 'None', 'SyntaxError'], 'A return in finally overrides the pending return from try. This also silently swallows exceptions, so avoid it.'],
  ['iterators', 'What is printed?', 'it = iter([1, 2, 3, 4])\nprint(3 in it)\nprint(list(it))', ['True, then [4]', 'True, then [1, 2, 3, 4]', 'True, then []', 'False, then [4]'], 'The in test consumes the iterator up to and including the match.'],
  ['collections', 'What does this print?', 'from collections import OrderedDict\nprint(OrderedDict(a=1, b=2) == OrderedDict(b=2, a=1))', ['False', 'True', 'TypeError', 'None'], 'Comparing two OrderedDicts is order-sensitive. Comparing plain dicts is not.'],
  ['collections', 'What is the result?', 't = ([1],)\nt[0] += [2]', ['TypeError is raised, yet t[0] is now [1, 2]', 'TypeError is raised and t is unchanged', 't becomes ([1, 2],) with no error', 't becomes ([1], [2])'], '+= first extends the list in place (that succeeds), then tries to assign back into the tuple (that fails).'],
  ['errors', 'A context manager’s __exit__ returns True. What happens to an exception raised inside the with block?', null, ['It is suppressed', 'It is re-raised after __exit__', 'It becomes a RuntimeError', '__exit__ is skipped'], 'A truthy return value from __exit__ tells Python the exception has been handled.'],
  ['concurrency', 'Roughly how long does main() take?', 'import asyncio\n\nasync def work():\n    await asyncio.sleep(1)\n\nasync def main():\n    await asyncio.gather(work(), work())', ['About 1 second', 'About 2 seconds', 'Instantly', 'It deadlocks'], 'gather runs both coroutines concurrently on the event loop, so their sleeps overlap.'],
  ['functions', 'A decorator returns an inner function named wrapper without using functools.wraps. What is decorated_func.__name__?', null, ["'wrapper'", 'The original function name', "'decorator'", "'<lambda>'"], 'Without functools.wraps, metadata such as __name__ and __doc__ comes from the wrapper.'],
  ['basics', 'What does this print?', 'print(False == False in [False])', ['True', 'False', 'TypeError', '[True]'], 'Comparison operators chain: this means (False == False) and (False in [False]).'],
];
