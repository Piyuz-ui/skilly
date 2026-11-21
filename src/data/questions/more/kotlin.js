// Extra Kotlin questions (IDs continue at kt-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'println(7 / 2)', ['3', '3.5', '4', '3.0'], 'Dividing two Ints gives an Int.'],
  ['basics', 'What is printed?', 'val name = "Riya"\nprintln("Hi $name")', ['Hi Riya', 'Hi $name', 'Hi name', 'HiRiya'], '$name inserts the value into the string.'],
  ['nulls', 'What is printed?', 'val s: String? = null\nprintln(s ?: "none")', ['none', 'null', 'NullPointerException', 'Empty line'], 'The Elvis operator ?: supplies a default for null.'],
  ['collections', 'What is printed?', 'val list = listOf(1, 2, 3)\nprintln(list.size)', ['3', '2', '6', 'Compile error'], 'size is the number of elements.'],
  ['control', 'What is printed?', 'for (i in 3 downTo 1) print(i)', ['321', '123', '32', '3210'], 'downTo counts backwards and includes both ends.'],
  ['basics', 'How do val and var differ?', null, ['val cannot be reassigned; var can', 'var is faster', 'val is only for numbers', 'There is no difference'], 'Prefer val unless the variable must change.'],
  ['control', 'What is printed?', 'val x = 5\nprintln(if (x > 3) "big" else "small")', ['big', 'small', 'true', 'Compile error'], 'if is an expression in Kotlin and returns a value.'],
  ['collections', 'What is printed?', 'println(listOf(1, 2, 3).map { it * 2 })', ['[2, 4, 6]', '[1, 2, 3]', '246', '[2, 4]'], 'map transforms each element; it is the default parameter name.'],
];

export const medium = [
  ['nulls', 'What is printed?', 'val s: String? = "hi"\nprintln(s?.length)', ['2', 'null', 'Optional(2)', 'Compile error'], 's is not null, so the safe call returns its length.'],
  ['nulls', 'What is printed?', 'val s: String? = null\nprintln(s?.length ?: -1)', ['-1', 'null', '0', 'NullPointerException'], 's?.length is null, so the Elvis operator returns -1.'],
  ['classes', 'What is printed?', 'data class P(val x: Int)\n// …\nprintln(P(1) == P(1))', ['true', 'false', 'Compile error', 'P(x=1)'], 'Data classes generate equals() based on their properties.'],
  ['collections', 'What is printed?', 'println(listOf(3, 1, 2).sorted())', ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', '123'], 'sorted() returns a new list in ascending order.'],
  ['control', 'What is printed?', 'val n = 3\nprintln(when (n) {\n  1, 2 -> "low"\n  in 3..5 -> "mid"\n  else -> "high"\n})', ['mid', 'low', 'high', 'Compile error'], 'when matches the first branch that fits; 3 is in 3..5.'],
  ['functions', 'What is printed?', 'fun greet(name: String = "friend") = "Hi $name"\n// …\nprintln(greet())', ['Hi friend', 'Hi', 'Hi null', 'Compile error'], 'Default parameter values are used when an argument is left out.'],
  ['collections', 'What is printed?', 'println(listOf(1, 2, 3, 4).filter { it % 2 == 0 }.sum())', ['6', '10', '4', '[2, 4]'], 'filter keeps 2 and 4, then sum adds them.'],
  ['classes', 'What does a data class generate automatically?', null, ['equals, hashCode, toString, copy and componentN', 'Only a constructor', 'Database tables', 'Getters for private fields only'], 'This saves a lot of boilerplate for classes that just hold data.'],
];

export const hard = [
  ['nulls', 'What does the !! operator do?', null, ['Throws NullPointerException if the value is null', 'Converts null to an empty string', 'Makes a variable nullable', 'Checks two values are equal'], 'Use it sparingly; prefer ?. and ?:.'],
  ['coroutines', 'What does launch return, compared with async?', null, ['launch returns a Job; async returns a Deferred with a result', 'Both return the result directly', 'launch returns a Thread', 'async blocks until finished'], 'Use async/await when you need a value back.'],
  ['functions', 'What is printed?', 'fun String.shout() = uppercase() + "!"\n// …\nprintln("hi".shout())', ['HI!', 'hi!', 'HI', 'Compile error'], 'An extension function adds shout() to String without changing its source.'],
  ['classes', 'What is printed?', 'data class P(val x: Int, val y: Int)\n// …\nval p = P(1, 2).copy(y = 5)\nprintln(p)', ['P(x=1, y=5)', 'P(x=1, y=2)', 'P(1, 5)', 'Compile error'], 'copy() makes a new object, changing only the named properties.'],
  ['collections', 'What is printed?', 'println(listOf("a", "bb", "cc").groupBy { it.length })', ['{1=[a], 2=[bb, cc]}', '{a=1, bb=2, cc=2}', '[[a], [bb, cc]]', '{1=a, 2=cc}'], 'groupBy builds a map from each key to the list of matching items.'],
  ['generics', 'What does out mean in List<out T>?', null, ['T is only produced, so List<Cat> can be used as List<Animal>', 'T must be a primitive', 'The list is mutable', 'T is passed as an output parameter'], 'out makes the type covariant.'],
  ['classes', 'What is a sealed class used for?', null, ['A closed set of subclasses, so when can check every case', 'A class that cannot have methods', 'Thread-safe objects', 'Encrypted data'], 'The compiler knows all subclasses, so a when without else can be exhaustive.'],
  ['functions', 'What is printed?', 'val sq = { x: Int -> x * x }\nprintln(listOf(1, 2, 3).map(sq).last())', ['9', '3', '[1, 4, 9]', '6'], 'The lambda squares each item; last() takes 9.'],
];
