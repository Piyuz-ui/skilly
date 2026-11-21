// Extra Dart questions (IDs continue at dart-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'print(7 ~/ 2);', ['3', '3.5', '4', '3.0'], '~/ is integer division in Dart.'],
  ['basics', 'What is printed?', 'print(7 / 2);', ['3.5', '3', '4', '3.0'], '/ always returns a double.'],
  ['nulls', 'What is printed?', "String? s;\nprint(s ?? 'none');", ['none', 'null', 'An error', 'Empty line'], 'An uninitialised nullable variable is null; ?? supplies the default.'],
  ['collections', 'What is printed?', 'var list = [1, 2, 3];\nlist.add(4);\nprint(list.length);', ['4', '3', '5', '10'], 'add appends one element.'],
  ['basics', 'What is printed?', "var name = 'Riya';\nprint('Hi \$name');", ['Hi Riya', 'Hi $name', 'Hi name', 'Hi'], '$name interpolates the variable.'],
  ['basics', 'How do final and const differ in Dart?', null, ['final is set once at runtime; const must be known at compile time', 'They are identical', 'const can be reassigned', 'final is only for classes'], 'const values are compile-time constants and can be shared.'],
  ['collections', 'What is printed?', 'print([1, 2, 3].map((x) => x * 2).toList());', ['[2, 4, 6]', '(2, 4, 6)', '[1, 2, 3]', '246'], 'map is lazy; toList() turns the result into a list.'],
  ['flutter', 'In Flutter, what is a widget?', null, ['A description of part of the UI; screens are built from widgets', 'A database table', 'A background service', 'A CSS file'], 'Layouts, text, buttons and padding are all widgets.'],
];

export const medium = [
  ['nulls', 'What is printed?', "String? s = 'hi';\nprint(s?.length);", ['2', 'null', 'An error', 'hi'], 's is not null, so the safe call returns its length.'],
  ['functions', 'What is printed?', 'int add(int a, [int b = 10]) => a + b;\n// …\nprint(add(5));', ['15', '5', 'An error', '510'], '[int b = 10] is an optional positional parameter with a default.'],
  ['functions', 'What is printed?', "void greet({required String name}) => print('Hi \$name');\n// …\ngreet(name: 'Ana');", ['Hi Ana', 'Hi name', 'Hi', 'An error'], 'Named parameters are passed with name: value; required makes them mandatory.'],
  ['collections', 'What is printed?', "var m = {'a': 1};\nm['b'] = 2;\nprint(m.keys.toList());", ['[a, b]', "['a', 'b']", '[1, 2]', '{a, b}'], 'Maps keep insertion order; printing a list of strings shows them without quotes.'],
  ['classes', 'What is printed?', "var sb = StringBuffer()\n  ..write('a')\n  ..write('b');\nprint(sb);", ['ab', 'a', 'b', 'StringBuffer'], 'The cascade .. calls several methods on the same object.'],
  ['async', 'What does await do in Dart?', null, ['Waits for a Future to finish inside an async function', 'Starts a new isolate', 'Blocks the whole app', 'Cancels a Future'], 'Code after await continues when the Future completes.'],
  ['flutter', 'How do StatelessWidget and StatefulWidget differ?', null, ['A stateful widget keeps changing data and rebuilds with setState', 'Stateless widgets cannot show text', 'Stateful widgets are faster', 'There is no difference'], 'Use StatelessWidget when the UI depends only on its inputs.'],
  ['collections', 'What is printed?', 'print([3, 1, 2]..sort());', ['[1, 2, 3]', '[3, 1, 2]', 'null', 'An error'], 'sort() returns void, but the cascade returns the list itself after sorting.'],
];

export const hard = [
  ['nulls', 'What does the late keyword do?', null, ['Promises a non-nullable variable is set before use, checked at runtime', 'Delays the program start', 'Makes a variable nullable', 'Runs code in the background'], 'Reading a late variable before it is set throws an error.'],
  ['async', 'In what order are the letters printed?', "print('A');\nFuture(() => print('B'));\nFuture.microtask(() => print('C'));\nprint('D');", ['A D C B', 'A B C D', 'A D B C', 'A C D B'], 'Synchronous code runs first, then microtasks, then event-queue Futures.'],
  ['classes', 'What can a factory constructor do that a normal constructor cannot?', null, ['Return an existing instance or a subtype', 'Take parameters', 'Set final fields', 'Be called with new'], 'Factories are useful for caches and singletons.'],
  ['collections', 'What is printed?', 'print([1, 2, 3].fold(0, (a, b) => a + b));', ['6', '0', '123', '[1, 2, 3]'], 'fold starts at 0 and combines each element.'],
  ['classes', 'What is printed?', 'class P {\n  final int x;\n  const P(this.x);\n}\n// …\nprint(identical(const P(1), const P(1)));', ['true', 'false', 'An error', '1'], 'Identical const expressions are canonicalised into one shared object.'],
  ['async', 'What is a Stream?', null, ['A sequence of asynchronous events over time', 'A single future value', 'A file on disk', 'A Flutter layout'], 'Listen to a stream or use await for to handle each event.'],
  ['flutter', 'Why give widgets a const constructor?', null, ['So Flutter can reuse instances and skip rebuilding them', 'To make them stateful', 'To allow setState', 'It is required for every widget'], 'const widgets are created once and compared cheaply.'],
  ['nulls', 'What is printed?', 'int? x;\nprint(x?.isEven ?? false);', ['false', 'null', 'true', 'An error'], 'x is null, so x?.isEven is null and ?? gives false.'],
];
