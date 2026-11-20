// C# question bank (C# 10+ / .NET 6+). Row format documented in python.js. Append only.
// roadmap.sh has no C#-only roadmap; ASP.NET Core is the closest match.
export const meta = {
  id: 'csharp',
  label: 'C#',
  roadmap: 'aspnet-core',
  topics: [
    { key: 'basics', label: 'Syntax & types', keywords: ['learn-the-basics-of-c', 'framework-basics', 'general-development-skills'] },
    { key: 'strings', label: 'Strings', keywords: ['learn-the-basics-of-c'] },
    { key: 'collections', label: 'Collections', keywords: ['data-structures-and-algorithms', 'learn-the-basics-of-c'] },
    { key: 'control', label: 'Conditions & loops', keywords: ['learn-the-basics-of-c'] },
    { key: 'oop', label: 'Classes & OOP', keywords: ['learn-the-basics-of-c', 'dependency-injection'] },
    { key: 'exceptions', label: 'Exceptions', keywords: ['learn-the-basics-of-c', 'log-frameworks'] },
    { key: 'linq', label: 'LINQ', keywords: ['entity-framework-core', 'object-relational-mapping', 'lazy-eager-explicit-loading'] },
    { key: 'async', label: 'Async & tasks', keywords: ['native-background-service', 'task-scheduling', 'real-time-communication'] },
  ],
};

export const easy = [
  ['basics', 'What is x?', 'int x = 7 / 2;', ['3', '3.5', '4', 'Compile error'], 'int / int performs integer division.'],
  ['strings', 'What does this print?', 'string name = "Ana";\nConsole.WriteLine($"Hi {name}");', ['Hi Ana', 'Hi {name}', '$Hi Ana', 'Compile error'], 'The $ prefix enables string interpolation.'],
  ['basics', 'What does var do in var n = 5;?', null, ['The compiler infers n as int at compile time', 'n is dynamically typed', 'n can later hold a string', 'n is a constant'], 'var is still statically typed. dynamic is the dynamic option.'],
  ['collections', 'What is nums.Count?', 'var nums = new List<int>();\nnums.Add(1);', ['1', '0', 'It throws', 'Count is a method: Count()'], 'List<T>.Count is a property holding the number of elements.'],
  ['basics', 'Which type holds true or false?', null, ['bool', 'boolean', 'bit', 'Bool8'], 'bool is an alias for System.Boolean.'],
  ['basics', 'What does Console.WriteLine do?', null, ['Writes text followed by a newline to standard output', 'Reads a line', 'Writes without a newline', 'Logs to a file'], 'Console.Write omits the newline.'],
  ['collections', 'What is a[2]?', 'int[] a = new int[3];', ['0', 'null', 'Random memory', 'IndexOutOfRangeException'], 'Array elements default to 0 for numeric types.'],
  ['control', 'What is printed?', 'for (int i = 0; i < 3; i++) Console.Write(i);', ['012', '123', '0123', '01'], 'The loop runs for i = 0, 1, 2.'],
  ['oop', 'What is the default accessibility of a class member with no modifier?', null, ['private', 'public', 'internal', 'protected'], 'Class members default to private. Top-level types default to internal.'],
  ['basics', 'With nullable reference types enabled, how do you declare a string that may be null?', null, ['string? s = null;', 'string s = null!;', 'nullable string s;', 'String s = Nothing;'], 'The ? annotation marks a nullable reference.'],
  ['exceptions', 'What does int.Parse("abc") throw?', null, ['FormatException', 'NullReferenceException', 'InvalidCastException', 'It returns 0'], 'Use int.TryParse to avoid the exception.'],
  ['control', 'What is printed?', 'int x = 4;\nConsole.Write(x % 2 == 0 ? "even" : "odd");', ['even', 'odd', '0', 'True'], 'The ternary picks "even" because 4 % 2 is 0.'],
  ['oop', 'What is public string Name { get; set; }?', null, ['An auto-implemented property', 'A public field', 'A method', 'An indexer'], 'The compiler generates a hidden backing field.'],
  ['strings', 'How do you get the number of characters in a string s?', null, ['s.Length', 's.Count', 's.Size()', 'len(s)'], 'Length is a property on string and arrays.'],
  ['basics', 'What does using System; at the top of a file do?', null, ['It lets you use types in the System namespace without full qualification', 'It disposes System', 'It imports a NuGet package', 'It makes the file static'], 'using directives import namespaces.'],
  ['basics', 'Which is valid?', null, ['const int Max = 10;', 'const int Max = DateTime.Now.Year;', 'const var Max = 10;', 'const Max = 10;'], 'const requires a compile-time constant and an explicit type.'],
];

export const medium = [
  ['basics', 'What is printed?', 'struct P { public int X; }\n\nvar a = new P { X = 1 };\nvar b = a;\nb.X = 2;\nConsole.Write(a.X);', ['1', '2', '0', 'Compile error'], 'Structs are value types. Assignment copies the whole value.'],
  ['strings', 'What is printed?', 'string a = "a";\nstring b = new string(\'a\', 1);\nConsole.Write(a == b);', ['True', 'False', 'Compile error', 'It depends on interning'], 'string overloads == to compare contents.'],
  ['linq', 'What does q.Count() return?', 'var list = new List<int> { 1, 2 };\nvar q = list.Where(x => x > 1);\nlist.Add(5);\nConsole.Write(q.Count());', ['2', '1', '3', 'InvalidOperationException'], 'LINQ queries use deferred execution. They run when enumerated and see 2 and 5.'],
  ['exceptions', 'What does a using declaration or statement guarantee?', null, ['Dispose() is called when the scope ends, even if an exception is thrown', 'The object is garbage-collected immediately', 'The namespace is imported', 'Thread safety'], 'The compiler wraps the scope in try/finally.'],
  ['oop', 'Derived declares Show() with `new` (not override). What does this call?', 'Base b = new Derived();\nb.Show();', ['Base.Show', 'Derived.Show', 'Both', 'Compile error'], 'new hides the base member, so dispatch uses the static type. override would call Derived.Show.'],
  ['collections', 'What does dict["missing"] do on a Dictionary<string, int>?', null, ['Throws KeyNotFoundException', 'Returns 0', 'Returns null', 'Adds the key'], 'Use TryGetValue or GetValueOrDefault.'],
  ['basics', 'What is the value?', 'string s = null;\nvar r = s ?? "default";', ['"default"', 'null', '""', 'NullReferenceException'], '?? returns the right-hand side when the left is null.'],
  ['oop', 'Which is true of out parameters?', null, ['The method must assign them before returning', 'The caller must initialise them', 'They are read-only', 'They are passed by value'], 'ref requires the caller to initialise. out requires the callee to assign.'],
  ['collections', 'What happens when you call list.Remove(x) inside foreach (var x in list)?', null, ['InvalidOperationException: the collection was modified', 'It works', 'An infinite loop', 'A compile error'], 'Iterate over a copy or use RemoveAll.'],
  ['async', 'What does await do on an incomplete Task?', null, ['It yields control and resumes when the task completes, without blocking the thread', 'It blocks the thread until done', 'It starts a new thread', 'It cancels the task'], 'The rest of the method continues as a continuation.'],
  ['basics', 'In the default unchecked context, what is printed?', 'int x = int.MaxValue;\nx = x + 1;\nConsole.Write(x);', ['-2147483648', '2147483648', 'OverflowException', 'Compile error'], 'Overflow wraps silently unless you use a checked context.'],
  ['linq', 'What is printed?', 'var r = new[] { 1, 2, 3, 4 }\n    .Where(n => n % 2 == 0)\n    .Select(n => n * n);\nConsole.Write(string.Join(",", r));', ['4,16', '1,9', '2,4', '1,4,9,16'], 'Where keeps 2 and 4. Select squares them.'],
  ['oop', 'How many base classes and interfaces can a C# class have?', null, ['One base class, any number of interfaces', 'Any number of each', 'One of each', 'No interfaces if it has a base class'], 'C# has single class inheritance.'],
  ['oop', 'Which is true of a static class?', null, ['It cannot be instantiated and holds only static members', 'It can be inherited', 'It must be sealed and abstract manually', 'It can implement interfaces'], 'Static classes are implicitly sealed and abstract.'],
  ['strings', 'Why prefer StringBuilder when concatenating inside a large loop?', null, ['Strings are immutable, so each + allocates a new string', 'string has no + operator', 'StringBuilder is thread-safe', 'It compresses text'], 'StringBuilder appends into a growing buffer.'],
  ['exceptions', 'Inside a catch block, how does `throw;` differ from `throw ex;`?', null, ['throw; preserves the original stack trace', 'They are identical', 'throw ex; preserves more detail', 'throw; swallows the exception'], 'throw ex; resets the stack trace to the current location.'],
];

export const hard = [
  ['async', 'Why should you avoid async void outside event handlers?', null, ['Callers cannot await it, and its exceptions cannot be caught by the caller', 'It does not compile', 'It runs synchronously', 'It leaks threads'], 'Return Task so callers can await and observe failures.'],
  ['async', 'What does ConfigureAwait(false) do?', null, ['The continuation does not need to resume on the captured synchronisation context', 'It disables the await', 'It runs the task synchronously', 'It cancels on timeout'], 'It is useful in library code to avoid context hops and certain deadlocks.'],
  ['oop', 'What is printed?', 'var actions = new List<Action>();\nfor (int i = 0; i < 3; i++)\n    actions.Add(() => Console.Write(i));\nforeach (var a in actions) a();', ['333', '012', '000', '222'], 'A for-loop variable is shared across iterations. foreach creates a fresh variable each time (since C# 5).'],
  ['collections', 'P is a mutable struct. What happens?', 'var list = new List<P> { new P() };\nlist[0].X = 5;', ['Compile error: cannot modify the return value because it is not a variable', 'list[0].X becomes 5', 'A copy is modified silently', 'A runtime exception'], 'The indexer returns a copy. Arrays would allow it because they give direct element access.'],
  ['linq', 'An iterator method uses yield return and is enumerated twice. What happens?', null, ['The method body runs twice', 'Results are cached after the first time', 'The second enumeration throws', 'It returns nothing the second time'], 'Materialise with ToList() if enumeration is expensive.'],
  ['basics', 'What is printed?', 'object a = 5, b = 5;\nConsole.Write($"{a == b} {a.Equals(b)}");', ['False True', 'True True', 'False False', 'True False'], 'Each boxed int is a separate object. == on object compares references.'],
  ['oop', 'You override Equals. What else must you do?', null, ['Override GetHashCode so equal objects have equal hash codes', 'Nothing', 'Implement IDisposable', 'Mark the class sealed'], 'Dictionaries and HashSets rely on the hash code first.'],
  ['basics', 'Why can’t a Span<T> be stored in a field of a class?', null, ['Span<T> is a ref struct and must live on the stack', 'Spans are always read-only', 'Classes cannot have generic fields', 'It can be'], 'ref structs cannot be boxed or captured, and cannot be fields of heap types.'],
  ['oop', 'Which is true about record class types?', null, ['They have value-based equality, and `with` creates a non-destructive copy', 'They are value types', 'They cannot have methods', 'Their properties are always mutable'], 'record struct is the value-type variant.'],
  ['control', 'What is r?', 'object o = 3.5;\nvar r = o switch {\n    int i => "int",\n    double d when d > 3 => "big double",\n    _ => "other"\n};', ['"big double"', '"int"', '"other"', 'Compile error'], 'Switch expressions test patterns in order. _ is the discard fallback.'],
  ['async', 'Why can’t you use await inside a lock block?', null, ['A lock is thread-affine; the continuation could resume on another thread', 'await is slow', 'lock is obsolete', 'You can'], 'Use SemaphoreSlim.WaitAsync for async mutual exclusion.'],
  ['basics', 'What do nullable reference type annotations do at runtime?', null, ['Nothing — they drive compile-time warnings only', 'They throw on null assignment', 'They wrap values in Nullable<T>', 'They slow down access'], 'Still validate inputs at public boundaries.'],
  ['linq', 'In an EF Core query, how does IQueryable<T> differ from IEnumerable<T>?', null, ['IQueryable builds expression trees that the provider can translate, for example to SQL', 'They are identical', 'IEnumerable runs in the database', 'IQueryable is always in memory'], 'Calling AsEnumerable() too early pulls the rows into memory.'],
  ['exceptions', 'Why call GC.SuppressFinalize(this) in Dispose()?', null, ['The resources are already released, so the finaliser does not need to run', 'To force collection', 'To prevent Dispose from running twice', 'It is required by the compiler'], 'This is part of the standard dispose pattern.'],
  ['async', 'Why can calling task.Result inside a UI event handler deadlock?', null, ['The UI thread blocks while the task’s continuation waits to resume on that same UI thread', 'Result is always unsafe', 'Tasks cannot run on UI threads', 'It cannot'], 'Use await all the way up.'],
  ['collections', 'Which assignment compiles?', null, ['IEnumerable<object> e = new List<string>();', 'List<object> l = new List<string>();', 'IList<object> l = new List<string>();', 'None of them'], 'IEnumerable<out T> is covariant. List<T> and IList<T> are invariant.'],
];
