// Extra Java questions (IDs continue at java-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'int a = 7, b = 2;\nSystem.out.println(a / b);', ['3', '3.5', '4', '3.0'], 'Dividing two ints gives an int; the fraction is dropped.'],
  ['strings', 'What is printed?', 'String s = "Java";\nSystem.out.println(s.length());', ['4', '5', '3', 'Compile error'], 'length() counts the characters.'],
  ['strings', 'What is printed?', 'String s = "Hello";\nSystem.out.println(s.charAt(1));', ['e', 'H', 'l', 'Compile error'], 'charAt uses zero-based indexes, so index 1 is the second character.'],
  ['strings', 'What is printed?', 'System.out.println(1 + 2 + "a");', ['3a', '12a', 'a3', 'Compile error'], '1 + 2 is added first (3), then "a" is concatenated.'],
  ['control', 'What is printed?', 'for (int i = 0; i < 3; i++) System.out.print(i);', ['012', '123', '0 1 2', '0123'], 'print writes without a newline or spaces.'],
  ['collections', 'What is printed?', 'List<Integer> list = new ArrayList<>();\nlist.add(5);\nlist.add(7);\nSystem.out.println(list.size());', ['2', '12', '7', '1'], 'size() is the number of elements.'],
  ['basics', 'What is the default value of an int field in a class?', null, ['0', 'null', 'Undefined (garbage)', '-1'], 'Fields get default values (0, false, null). Local variables must be assigned before use.'],
  ['oop', 'Which keyword calls the parent class’s constructor?', null, ['super', 'this', 'parent', 'base'], 'super(...) must be the first statement in the child constructor.'],
];

export const medium = [
  ['strings', 'What is printed?', 'String a = "hi";\nString b = new String("hi");\nSystem.out.println(a.equals(b));', ['true', 'false', 'Compile error', 'hi'], 'equals compares the characters.'],
  ['strings', 'What is printed?', 'String a = "hi";\nString b = new String("hi");\nSystem.out.println(a == b);', ['false', 'true', 'Compile error', 'hi'], '== compares references; new String creates a separate object. Use equals for text.'],
  ['collections', 'What is printed?', 'Map<String, Integer> m = new HashMap<>();\nm.put("a", 1);\nm.put("a", 2);\nSystem.out.println(m.get("a") + " " + m.size());', ['2 1', '1 2', '2 2', '3 1'], 'Putting an existing key replaces its value; the map still has one entry.'],
  ['exceptions', 'What is printed?', 'try {\n  int[] x = new int[2];\n  x[2] = 1;\n} catch (ArrayIndexOutOfBoundsException e) {\n  System.out.println("caught");\n}', ['caught', 'Nothing', '1', 'The program crashes'], 'Valid indexes are 0 and 1; index 2 throws and is caught.'],
  ['oop', 'What do default methods in interfaces allow?', null, ['Adding a method with a body without breaking existing implementations', 'Creating objects from an interface', 'Private fields in interfaces', 'Multiple constructors'], 'Classes that implement the interface get the default body unless they override it.'],
  ['control', 'What is printed?', 'int x = 2;\nswitch (x) {\n  case 1: System.out.print("a");\n  case 2: System.out.print("b");\n  case 3: System.out.print("c");\n}', ['bc', 'b', 'abc', 'Nothing'], 'Classic switch falls through to the next case without break.'],
  ['strings', 'What is printed?', 'StringBuilder sb = new StringBuilder("ab");\nsb.append("c").reverse();\nSystem.out.println(sb);', ['cba', 'abc', 'ab', 'cab'], 'StringBuilder is mutable; append then reverse change it in place.'],
  ['generics', 'Why can’t you write List<int>?', null, ['Generics need object types, so use List<Integer>', 'int is too small', 'List only stores Strings', 'You can; it compiles fine'], 'Primitives are boxed into wrapper types (Integer) for generic collections.'],
];

export const hard = [
  ['basics', 'What is printed?', 'Integer a = 128, b = 128;\nSystem.out.println(a == b);', ['false', 'true', 'Compile error', '128'], 'By default only Integers from -128 to 127 are cached; 128 creates two objects, and == compares references.'],
  ['exceptions', 'What does f() return?', 'static int f() {\n  try {\n    return 1;\n  } finally {\n    return 2;\n  }\n}', ['2', '1', 'Compile error', 'It throws'], 'A return in finally overrides the try block’s return.'],
  ['concurrency', 'What does the volatile keyword guarantee?', null, ['Writes are visible to other threads immediately', 'Operations like count++ become atomic', 'Only one thread can run the method', 'The variable cannot change'], 'volatile gives visibility and ordering, not atomicity; use AtomicInteger or locks for count++.'],
  ['collections', 'Removing items from an ArrayList inside a for-each loop over it usually throws…', null, ['ConcurrentModificationException', 'NullPointerException', 'IndexOutOfBoundsException', 'Nothing'], 'Use an Iterator’s remove() or list.removeIf(...) instead.'],
  ['generics', 'What is type erasure?', null, ['Generic types are removed after compiling, so List<String> and List<Integer> are the same class at runtime', 'Types are checked only at runtime', 'Unused types are deleted', 'Generics become Object arrays'], 'This is why you cannot write new T() or check instanceof List<String>.'],
  ['oop', 'Can a static method be overridden?', null, ['No: it is hidden, and the call depends on the reference type', 'Yes, like any method', 'Only in abstract classes', 'Only if marked final'], 'Static methods belong to the class; a subclass method with the same signature hides it.'],
  ['strings', 'What is printed?', 'String s = "a";\ns.concat("b");\nSystem.out.println(s);', ['a', 'ab', 'b', 'null'], 'Strings are immutable; concat returns a new string that is ignored here.'],
  ['concurrency', 'Main advantage of an ExecutorService over creating Threads by hand?', null, ['It reuses a pool of threads and manages queued tasks', 'Threads run faster', 'It removes the need for synchronization', 'It runs tasks in order on one core'], 'Creating threads is expensive; pools also make shutdown and results (Future) easier.'],
];
