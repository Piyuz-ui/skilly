// Kotlin question bank (Kotlin 1.9+/2.x). Row format documented in python.js. Append only.
import { META } from './meta.js';

export const meta = META.kotlin;

export const easy = [
  ['basics', 'What happens here?', 'val x = 5\nx = 6', ['A compile error: val cannot be reassigned', 'x becomes 6', 'A runtime exception', 'x stays 5 silently'], 'val is read-only after initialisation. Use var for a variable you reassign.'],
  ['basics', 'What type does Kotlin infer for n?', 'val n = 3', ['Int', 'Long', 'Number', 'Any'], 'Integer literals that fit default to Int.'],
  ['basics', 'What is printed?', 'val name = "Ann"\nprintln("Hi $name")', ['Hi Ann', 'Hi $name', 'Hi name', 'A compile error'], '$name inside a string template inserts the value.'],
  ['nulls', 'What happens?', 'var s: String = null', ['A compile error — String is non-nullable', 's is null', 'A NullPointerException', 's becomes ""'], 'Only nullable types such as String? can hold null.'],
  ['nulls', 'What is printed?', 'val s: String? = null\nprintln(s?.length)', ['null', '0', 'NullPointerException', 'A compile error'], 'The safe-call operator ?. returns null instead of throwing.'],
  ['control', 'What is the value?', 'when (3) {\n    1 -> "one"\n    3 -> "three"\n    else -> "other"\n}', ['"three"', '"one"', '"other"', 'A compile error'], 'when picks the first matching branch.'],
  ['collections', 'What does listOf(1, 2, 3).size return?', null, ['3', '2', '4', 'It does not compile'], 'size is a property on collections.'],
  ['collections', 'What does this return?', 'listOf(1, 2, 3).map { it * 2 }', ['[2, 4, 6]', '[1, 2, 3]', '12', '[1, 4, 9]'], 'map applies the lambda to every element. it is the implicit single parameter.'],
  ['functions', 'What does add(2, 3) return?', 'fun add(a: Int, b: Int) = a + b', ['5', '23', 'Unit', 'A compile error'], 'An expression-body function returns the expression.'],
  ['control', 'What is printed?', 'for (i in 1..3) print(i)', ['123', '12', '0123', '321'], '1..3 is an inclusive range.'],
  ['control', 'What is printed?', 'for (i in 1 until 3) print(i)', ['12', '123', '23', '0123'], 'until excludes the upper bound.'],
  ['classes', 'What is printed?', 'data class P(val x: Int)\nprintln(P(1))', ['P(x=1)', 'P@1b6d3586', '1', 'P'], 'Data classes generate a readable toString.'],
  ['basics', 'What is 7 / 2 with Int operands?', null, ['3', '3.5', '4', '3.0'], 'Integer division truncates.'],
  ['basics', 'What does "kotlin".uppercase() return?', null, ['"KOTLIN"', '"Kotlin"', '"kotlin"', 'It changes the original string'], 'Strings are immutable. uppercase() returns a new string.'],
  ['collections', 'Which collection lets you call add()?', null, ['mutableListOf(1)', 'listOf(1)', 'setOf(1)', 'arrayOf(1).toList()'], 'listOf returns a read-only List. mutableListOf returns a MutableList.'],
  ['functions', 'What does greet() return?', 'fun greet(n: String = "you") = "Hi $n"', ['"Hi you"', '"Hi "', 'A compile error', '"Hi null"'], 'Default parameter values are used when an argument is omitted.'],
];

export const medium = [
  ['nulls', 'What is len when s is null?', 'val len = s?.length ?: 0', ['0', 'null', 'NullPointerException', '-1'], 'The Elvis operator ?: supplies a value when the left side is null.'],
  ['nulls', 'What happens when s is null?', 's!!.length', ['NullPointerException', 'Returns null', 'Returns 0', 'A compile error'], '!! asserts non-null and throws if it is null.'],
  ['classes', 'What does P(1) == P(1) evaluate to for a data class P?', null, ['true', 'false', 'A compile error', 'It depends on hashCode'], 'Data classes generate equals from primary-constructor properties. === would compare identity.'],
  ['collections', 'What is the result?', 'listOf(1, 2, 3, 4).filter { it % 2 == 0 }.sum()', ['6', '4', '10', '[2, 4]'], 'filter keeps 2 and 4. sum adds them.'],
  ['functions', 'What does "hi".shout() return?', 'fun String.shout() = uppercase() + "!"', ['"HI!"', '"hi!"', 'A compile error', '"HI"'], 'Extension functions add methods to existing types without inheritance.'],
  ['control', 'What is r?', 'val x = -1\nval r = if (x > 0) "pos" else "neg"', ['"neg"', '"pos"', 'Unit', 'A compile error'], 'if is an expression in Kotlin. There is no ternary operator.'],
  ['classes', 'Why does this fail?', 'class A\nclass B : A()', ['Classes are final by default — A must be open', 'B needs a body', 'A needs a constructor', 'It compiles'], 'Mark a class open (or abstract) to allow subclassing.'],
  ['collections', 'What does m["b"] return?', 'val m = mapOf("a" to 1)', ['null', '0', 'NoSuchElementException', 'A compile error'], 'The map indexer returns V? and gives null for missing keys.'],
  ['collections', 'What does this return?', 'listOf(3, 1, 2).sortedBy { -it }', ['[3, 2, 1]', '[1, 2, 3]', '[-3, -2, -1]', '[3, 1, 2]'], 'It sorts by the negated value, which is descending order.'],
  ['basics', 'What is "5" + 3?', null, ['"53"', '8', 'A compile error', '"8"'], 'String.plus accepts Any. Note that 3 + "5" does not compile.'],
  ['classes', 'You read a lateinit var before assigning it. What happens?', null, ['UninitializedPropertyAccessException', 'It returns null', 'A compile error', 'It returns the default value'], 'lateinit defers initialisation but still checks access at runtime.'],
  ['collections', 'What is the result?', 'listOf(1, 2, 3).fold(10) { acc, x -> acc + x }', ['16', '6', '10', '[11, 12, 13]'], 'fold starts from 10 and adds each element.'],
  ['control', 'Why does x.length compile without a cast?', 'fun f(x: Any) {\n    if (x is String) println(x.length)\n}', ['Smart cast: after the is check, x is treated as String', 'Any has length', 'length is an extension on Any', 'It does not compile'], 'The compiler narrows the type inside the checked branch.'],
  ['coroutines', 'How does async differ from launch?', null, ['async returns a Deferred whose result you await()', 'launch returns a value', 'async blocks the thread', 'There is no difference'], 'launch returns a Job and is fire-and-forget.'],
  ['classes', 'What is an object declaration such as object Config { … }?', null, ['A thread-safe, lazily created singleton', 'An abstract class', 'A data class', 'An interface'], 'Every reference to Config points to the same instance.'],
  ['basics', 'What does this return?', '"a,b,c".split(",").joinToString("-")', ['"a-b-c"', '"a,b,c"', '["a", "b", "c"]', '"abc"'], 'split makes a list. joinToString joins it with the separator.'],
];

export const hard = [
  ['collections', 'What is printed?', 'val a = listOf(1, 2)\nval b = a + 3\nprintln(a)', ['[1, 2]', '[1, 2, 3]', 'A compile error', '[3]'], 'plus on a read-only list returns a new list.'],
  ['classes', 'A when over a sealed class covers every subclass and has no else. What happens?', null, ['It compiles — the when is exhaustive', 'Compile error: else is required', 'A runtime warning', 'It needs @Suppress'], 'Sealed hierarchies are known at compile time, so exhaustiveness is checked.'],
  ['coroutines', 'What is printed?', 'runBlocking {\n    launch { delay(100); print("A") }\n    print("B")\n}', ['BA', 'AB', 'A', 'B'], 'launch starts a child coroutine that suspends at delay. runBlocking waits for children before returning.'],
  ['coroutines', 'Where can a suspend function be called from?', null, ['Another suspend function or a coroutine', 'Anywhere', 'Only main()', 'Only from Java'], 'Suspension needs a coroutine context. Use builders such as launch or runBlocking.'],
  ['generics', 'Why can a List<String> be assigned to a List<Any>?', null, ['List is declared List<out E> — covariant', 'Kotlin ignores generics', 'Because of type erasure', 'It cannot'], 'Declaration-site variance (out) makes read-only List covariant. MutableList is invariant.'],
  ['generics', 'What does a reified type parameter require?', 'inline fun <reified T> isA(x: Any) = x is T', ['The function must be inline', 'T must be a class', 'A Class<T> argument', 'Nothing extra'], 'Inlining substitutes the real type at each call site, so it is available at runtime.'],
  ['functions', 'What does f() print?', 'fun f() {\n    listOf(1, 2, 3).forEach {\n        if (it == 2) return\n        print(it)\n    }\n    print("end")\n}', ['1', '13end', '1end', '123end'], 'In an inline lambda, a bare return is a non-local return from f. Use return@forEach to skip one item.'],
  ['classes', 'What does p.copy(x = 5) do?', null, ['Creates a new object with x = 5; p is unchanged', 'Changes p.x to 5', 'Copies p by reference', 'Only works for var properties'], 'copy enables immutable updates.'],
  ['collections', 'What is printed?', 'sequenceOf(1, 2, 3)\n    .map { print(it); it }\n    .first()', ['1', '123', 'Nothing', '321'], 'Sequences are lazy, so first() pulls only one element through map.'],
  ['classes', 'When does the lambda in `val v by lazy { … }` run?', null, ['Once, on first access', 'Every access', 'At class construction', 'Never — you must call it'], 'The result is cached after the first access. The default mode is thread-safe.'],
  ['classes', 'How do you call a function declared in a companion object of class C?', null, ['C.function()', 'C().function()', 'C.Companion only from Java', 'It cannot be called'], 'Companion members behave like static members.'],
  ['nulls', 'What is printed when s is null?', 's?.let { println(it) }', ['Nothing', 'null', 'NullPointerException', '"it"'], 'The safe call skips let entirely when s is null.'],
  ['control', 'What is a when with no argument equivalent to?', 'when {\n    x < 0 -> "neg"\n    x == 0 -> "zero"\n    else -> "pos"\n}', ['An if / else-if chain', 'A switch on x', 'A compile error', 'A loop'], 'Each branch is a boolean condition.'],
  ['coroutines', 'Which dispatcher suits blocking file or network I/O?', null, ['Dispatchers.IO', 'Dispatchers.Main', 'Dispatchers.Unconfined', 'Dispatchers.Default'], 'IO has an elastic thread pool designed for blocking calls. Default is sized for CPU work.'],
  ['generics', 'With a List<*>, what type do elements have when read?', null, ['Any?', 'Nothing', 'Any', 'The original type'], 'A star projection is safe to read as Any?. You cannot add elements.'],
  ['classes', 'In data class P(val x: Int) { var y = 0 }, which properties does equals use?', null, ['Only x — properties in the primary constructor', 'x and y', 'Only y', 'Identity only'], 'Body properties are excluded from generated equals, hashCode, toString and copy.'],
];
