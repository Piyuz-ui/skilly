// Extra C# questions (IDs continue at cs-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'int a = 7, b = 2;\nConsole.WriteLine(a / b);', ['3', '3.5', '4', '3.0'], 'Integer division drops the fraction.'],
  ['strings', 'What is printed?', 'string s = "C#";\nConsole.WriteLine(s.Length);', ['2', '1', '3', 'Compile error'], 'Length is a property (no parentheses).'],
  ['strings', 'What is printed?', 'var name = "Riya";\nConsole.WriteLine($"Hi {name}");', ['Hi Riya', 'Hi {name}', 'Hi name', '$Hi Riya'], '$"…" is an interpolated string.'],
  ['collections', 'What is printed?', 'var list = new List<int> { 1, 2 };\nlist.Add(3);\nConsole.WriteLine(list.Count);', ['3', '2', '6', 'Compile error'], 'Count is the number of items.'],
  ['control', 'What is printed?', 'int i = 0;\nwhile (i < 3) i += 2;\nConsole.WriteLine(i);', ['4', '3', '2', '6'], 'i goes 0 → 2 → 4; the loop stops once i is no longer below 3.'],
  ['basics', 'Which type should you use for money in C#?', null, ['decimal', 'double', 'float', 'int'], 'decimal stores base-10 values exactly, avoiding rounding errors like 0.1 + 0.2.'],
  ['basics', 'What is printed?', 'Console.WriteLine(10 % 3);', ['1', '3', '0', '3.33'], '% gives the remainder.'],
  ['oop', 'What does new do in var p = new Person();?', null, ['Creates an object (instance) of Person', 'Declares a new class', 'Copies an existing Person', 'Deletes the old p'], 'new calls the constructor and returns the new instance.'],
];

export const medium = [
  ['linq', 'What is printed?', 'var nums = new[] { 1, 2, 3, 4 };\nConsole.WriteLine(nums.Where(n => n % 2 == 0).Sum());', ['6', '10', '4', '2'], 'Where keeps 2 and 4; Sum adds them.'],
  ['strings', 'What is printed?', 'Console.WriteLine(string.Join(",", new[] { "a", "b" }));', ['a,b', 'ab', '[a, b]', 'a, b'], 'string.Join puts the separator between items.'],
  ['control', 'What is printed?', 'string? s = null;\nConsole.WriteLine(s ?? "none");', ['none', 'null', 'Empty line', 'NullReferenceException'], '?? returns the right side when the left is null.'],
  ['oop', 'How do a struct and a class differ in C#?', null, ['A struct is a value type copied on assignment; a class is a reference type', 'Structs cannot have methods', 'Classes cannot have fields', 'There is no difference'], 'Assigning a struct copies its data; assigning a class copies the reference.'],
  ['exceptions', 'What is printed?', 'try {\n  int.Parse("x");\n} catch (FormatException) {\n  Console.WriteLine("bad");\n}', ['bad', 'x', '0', 'Nothing'], '"x" is not a number, so Parse throws FormatException. int.TryParse avoids the exception.'],
  ['linq', 'What is printed?', 'var words = new[] { "bb", "a", "ccc" };\nConsole.WriteLine(words.OrderBy(w => w.Length).First());', ['a', 'bb', 'ccc', 'abbccc'], 'OrderBy sorts by length, so "a" comes first.'],
  ['collections', 'What is printed?', 'var d = new Dictionary<string, int>();\nd["a"] = 1;\nConsole.WriteLine(d.ContainsKey("b"));', ['False', 'false', 'True', '0'], 'C# prints booleans as "True" and "False".'],
  ['async', 'What does await do?', null, ['Pauses the method until the task finishes, without blocking the thread', 'Starts a new thread', 'Blocks the thread until done', 'Cancels the task'], 'The rest of the method continues when the awaited task completes.'],
];

export const hard = [
  ['linq', 'When does a LINQ query like nums.Where(n => n > 2) actually run?', null, ['When it is enumerated (deferred execution)', 'Immediately when the line runs', 'When the program ends', 'Only with ToString()'], 'Call ToList() or ToArray() to run it once and keep the results.'],
  ['oop', 'What is printed?', 'class A { public virtual string N() => "A"; }\nclass B : A { public override string N() => "B"; }\n// …\nA x = new B();\nConsole.WriteLine(x.N());', ['B', 'A', 'AB', 'Compile error'], 'override replaces the virtual method, so the real type B decides.'],
  ['oop', 'What is printed?', 'class A { public string N() => "A"; }\nclass B : A { public new string N() => "B"; }\n// …\nA x = new B();\nConsole.WriteLine(x.N());', ['A', 'B', 'AB', 'Compile error'], 'new hides the method; calls through an A reference use A’s version.'],
  ['exceptions', 'What does a using statement guarantee?', null, ['Dispose() is called even if an exception occurs', 'The object is never null', 'The code runs on a background thread', 'Exceptions are swallowed'], 'using is a try/finally that disposes the resource.'],
  ['async', 'Why avoid async void (except for event handlers)?', null, ['Callers can’t await it, and its exceptions can crash the process', 'It runs slower', 'It cannot use await', 'It always blocks the UI'], 'Return Task instead so callers can await and catch errors.'],
  ['collections', 'What is printed?', 'var a = new List<int> { 1 };\nvar b = a;\nb.Add(2);\nConsole.WriteLine(a.Count);', ['2', '1', '0', '3'], 'List is a class, so a and b refer to the same list.'],
  ['basics', 'What is printed (default compiler settings)?', 'int x = int.MaxValue;\nx++;\nConsole.WriteLine(x);', ['-2147483648', '2147483648', 'OverflowException', '0'], 'Arithmetic is unchecked by default, so it wraps around. Use checked { } to throw instead.'],
  ['linq', 'What is printed?', 'Console.WriteLine(Enumerable.Range(1, 4).Aggregate((a, b) => a * b));', ['24', '10', '4', '1234'], 'Range(1, 4) is 1, 2, 3, 4; Aggregate multiplies them.'],
];
