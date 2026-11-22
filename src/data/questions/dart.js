// Dart question bank (Dart 3, sound null safety). Row format documented in python.js. Append only.
import { META } from './meta.js';

export const meta = META.dart;

export const easy = [
  ['basics', 'What happens?', 'var x = 5;\nx = "a";', ['A compile error — x was inferred as int', 'x becomes "a"', 'A runtime error', 'x becomes dynamic'], 'var infers a static type from the initialiser.'],
  ['basics', 'How do final and const differ?', null, ['final is set once at runtime; const must be a compile-time constant', 'They are identical', 'const can be reassigned', 'final is only for classes'], 'Both prevent reassignment.'],
  ['basics', 'What does print(\'Hi $name\') print when name is "Ann"?', null, ['Hi Ann', 'Hi $name', 'Hi name', 'An error'], 'Use ${expr} for expressions.'],
  ['basics', 'What is 7 ~/ 2?', null, ['3', '3.5', '4', 'An error'], '~/ is integer division.'],
  ['basics', 'What is 7 / 2?', null, ['3.5', '3', '4', 'An error'], '/ always returns a double.'],
  ['collections', 'What does [1, 2, 3].length return?', null, ['3', '2', '4', 'null'], 'length is a property on lists.'],
  ['nulls', 'What happens?', 'String s = null;', ['A compile error — String is non-nullable', 's is null', 'A runtime error', 's is ""'], 'Use String? for nullable values.'],
  ['nulls', 'What does s?.length return when s is null?', null, ['null', '0', 'A runtime error', 'A compile error'], '?. short-circuits on null.'],
  ['nulls', 'What is the value of null ?? "x"?', null, ['"x"', 'null', 'An error', '""'], '?? supplies a fallback.'],
  ['basics', 'What is printed?', 'for (var i = 0; i < 3; i++) {\n  print(i);\n}', ['0, 1, 2 on separate lines', '1, 2, 3', '0 to 3', 'Nothing'], 'A classic C-style loop.'],
  ['basics', 'Where does a Dart program start?', null, ['void main()', 'start()', 'The first class', 'init()'], 'main can also take a List<String> of arguments.'],
  ['collections', "What does {'a': 1}['b'] return?", null, ['null', '0', 'An error', 'false'], 'Map lookups return a nullable value.'],
  ['functions', 'What does add(2, 3) return?', 'int add(int a, int b) => a + b;', ['5', '23', 'null', 'An error'], '=> expr is shorthand for { return expr; }.'],
  ['functions', 'How do you declare a required named parameter?', null, ['void f({required String name})', 'void f(String name?)', 'void f([String name])', 'void f(named String name)'], 'Callers write f(name: "Ann").'],
  ['basics', 'What does \'dart\'.toUpperCase() return?', null, ['\'DART\'', '\'Dart\'', '\'dart\'', 'null'], 'Strings are immutable.'],
  ['collections', 'What does {1, 2, 2}.length return?', null, ['2', '3', '1', 'An error'], 'A set literal removes duplicates.'],
];

export const medium = [
  ['basics', 'What does list..add(1)..add(2) evaluate to?', null, ['list itself, now with 1 and 2 added', 'The value 2', 'void', 'An error'], 'The cascade (..) runs operations on one object and returns that object.'],
  ['collections', 'What is the result?', 'var a = [1, 2];\nvar b = [...a, 3];', ['[1, 2, 3]', '[[1, 2], 3]', '[3]', 'An error'], 'The spread operator inserts all elements.'],
  ['collections', 'What is the list when flag is false?', '[1, if (flag) 2, 3]', ['[1, 3]', '[1, null, 3]', '[1, 2, 3]', 'An error'], 'Collection-if includes the element only when the condition holds.'],
  ['collections', 'What does this return?', '[1, 2, 3, 4].where((x) => x.isEven).map((x) => x * 10).toList()', ['[20, 40]', '[10, 30]', '[2, 4]', 'An Iterable'], 'where filters; toList materialises the lazy Iterable.'],
  ['nulls', 'What happens when you read a late variable before assigning it?', null, ['LateInitializationError at runtime', 'It returns null', 'A compile error', 'It returns 0'], 'late promises the value will be set before use.'],
  ['async', 'What does an async function return?', null, ['A Future', 'A Stream', 'The value directly', 'void'], 'Callers use await or .then.'],
  ['async', 'Where can await be used?', null, ['Inside an async function (or at the top level of some scripts)', 'Anywhere', 'Only in main', 'Only in Flutter widgets'], 'await pauses until the Future completes.'],
  ['classes', 'What does this constructor do?', 'class P {\n  final int x;\n  P(this.x);\n}', ['Assigns the argument to the field x', 'Declares a new local x', 'A compile error', 'Makes x static'], 'Initialising formals (this.x) remove boilerplate.'],
  ['classes', 'What is a factory constructor allowed to do?', null, ['Return an existing instance or a subtype instead of always creating a new one', 'Nothing special', 'Only create singletons', 'Run asynchronously'], 'Useful for caches and fromJson parsing.'],
  ['classes', 'What does identical(const P(1), const P(1)) return for a class with a const constructor?', null, ['true', 'false', 'An error', 'null'], 'Equal const expressions are canonicalised to one instance.'],
  ['classes', 'How do you add a mixin to a class?', null, ['class A extends B with Logger', 'class A implements Logger only', 'class A mixin Logger', 'class A uses Logger'], 'Mixins share code across class hierarchies.'],
  ['classes', 'How does implements differ from extends?', null, ['implements requires you to provide every member yourself; extends inherits the implementation', 'They are the same', 'implements inherits code', 'extends allows multiple classes'], 'Every class implicitly defines an interface.'],
  ['async', 'When should you use a Stream instead of a Future?', null, ['When you receive many asynchronous values over time', 'For exactly one value', 'For synchronous code', 'Never'], 'Examples are WebSocket messages or user input events.'],
  ['nulls', 'What happens when s! is used and s is null?', null, ['A runtime error is thrown', 'It returns null', 'A compile error', 'It returns ""'], 'The ! assertion promises the value is non-null.'],
  ['classes', 'What does int get area => w * h; declare?', null, ['A getter computed on each access', 'A field', 'A method that needs parentheses', 'A setter'], 'Callers read it like a field: shape.area.'],
  ['functions', 'What is an optional positional parameter?', 'void f(int a, [int b = 0]) {}', ['b may be omitted and defaults to 0', 'b is required', 'b is named', 'A syntax error'], 'Optional positional parameters go in square brackets.'],
];

export const hard = [
  ['async', 'What is the print order?', "print('A');\nFuture(() => print('B'));\nscheduleMicrotask(() => print('C'));\nprint('D');", ['A D C B', 'A B C D', 'A C B D', 'A D B C'], 'Synchronous code runs first, then microtasks, then event-queue tasks such as Future(...).'],
  ['async', 'How do isolates share data?', null, ['They do not share memory; they pass messages', 'Through global variables', 'Through locks', 'Through shared pointers'], 'Each isolate has its own heap, which removes data races.'],
  ['collections', 'What does [1] == [1] evaluate to?', null, ['false', 'true', 'An error', 'null'], 'Lists use identity equality. Use listEquals or the collection package.'],
  ['basics', 'What does <int>[] is List<String> evaluate to?', null, ['false', 'true', 'A compile error', 'null'], 'Dart generics are reified, so type arguments exist at runtime.'],
  ['functions', 'What do extension methods allow?', 'extension on String {\n  String shout() => toUpperCase() + "!";\n}', ['Adding methods to an existing type you do not own', 'Subclassing String', 'Changing String globally at runtime', 'Nothing'], 'They are resolved statically.'],
  ['classes', 'Why can a switch over a sealed class omit default?', null, ['The compiler knows every subtype and checks the switch is exhaustive', 'default is never needed', 'Sealed classes cannot be switched on', 'It cannot'], 'This is a Dart 3 feature.'],
  ['basics', 'What does this do?', "var (n, s) = (1, 'a');", ['Destructures a record into n and s', 'Creates a list', 'A syntax error', 'Declares a tuple class'], 'Records and patterns arrived in Dart 3.'],
  ['async', 'What does await Future.wait([a(), b()]) do?', null, ['Runs both futures concurrently and waits for all to finish', 'Runs them one after another', 'Returns the first result', 'Cancels them'], 'It fails if any future fails, unless eagerError is configured.'],
  ['async', 'How do you create a Stream with a generator function?', null, ['Mark it async* and yield values', 'Use async and return a list', 'Use sync* only', 'Use await for'], 'await for consumes streams.'],
  ['classes', 'What does the covariant keyword on a parameter allow?', null, ['An override to narrow the parameter type, with a runtime check', 'Generic variance', 'Making a field const', 'Nothing'], 'It is an explicit escape hatch from the usual override rules.'],
  ['collections', 'What happens?', 'final a = [1];\na.add(2);\nconst b = [1];\nb.add(2);', ['a.add works; b.add throws UnsupportedError at runtime', 'Both fail', 'Both work', 'A compile error on a.add'], 'final freezes the variable; const freezes the object itself.'],
  ['nulls', 'When does the initialiser of late final x = compute(); run?', null, ['Once, on first access', 'At declaration', 'Every access', 'Never'], 'This gives lazy initialisation.'],
  ['flutter', 'In a StatefulWidget, what does setState(() { … }) do?', null, ['Updates state and schedules a rebuild of the widget', 'Saves state to disk', 'Rebuilds the whole app synchronously', 'Nothing in release mode'], 'Only call it while the State object is mounted.'],
  ['flutter', 'When should you choose a StatelessWidget?', null, ['When the widget depends only on its configuration and inherited data', 'When it animates', 'When it holds form input', 'Never'], 'StatefulWidget holds mutable State.'],
  ['nulls', 'Why does `if (obj.name != null) obj.name.length` fail when name is a nullable field?', null, ['Fields are not type-promoted because they might change; copy to a local first', 'It works', 'length is not on String', 'name must be late'], 'Local variables promote; non-final fields do not.'],
  ['basics', 'How does dynamic differ from Object??', null, ['dynamic turns off static checking; Object? keeps it', 'They are identical', 'Object? allows any method call', 'dynamic is non-nullable'], 'Prefer Object? and cast explicitly.'],
];
