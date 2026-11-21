// Extra Rust questions (IDs continue at rs-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'println!("{}", 7 / 2);', ['3', '3.5', '4', '3.0'], 'Integer division truncates.'],
  ['basics', 'Are Rust variables mutable by default?', null, ['No: you write let mut to allow changes', 'Yes, always', 'Only numbers are', 'Only inside functions'], 'Immutability by default prevents accidental changes.'],
  ['basics', 'What is printed?', 'let x = 5;\nlet x = x * 2;\nprintln!("{}", x);', ['10', '5', 'Compile error: x is immutable', '25'], 'The second let creates a new x (shadowing); it does not mutate the first.'],
  ['collections', 'What is printed?', 'let v = vec![1, 2, 3];\nprintln!("{}", v.len());', ['3', '2', '6', 'Compile error'], 'len() is the number of elements.'],
  ['basics', 'What is printed?', 'let mut n = 0;\nwhile n < 3 {\n    n += 1;\n}\nprintln!("{}", n);', ['3', '2', '4', 'Compile error'], 'let mut allows n to change; the loop stops when n reaches 3.'],
  ['basics', 'What is printed?', 'let s = String::from("hi");\nprintln!("{}", s.len());', ['2', '3', '1', 'Compile error'], 'len() is the length in bytes; "hi" is 2 bytes.'],
  ['enums', 'What does Option<T> represent?', null, ['A value that is either Some(T) or None', 'A list of T', 'An error type', 'A mutable reference'], 'Rust has no null; Option makes "maybe missing" explicit.'],
  ['basics', 'What is printed?', 'let t = (1, "a");\nprintln!("{}", t.0);', ['1', 'a', '(1, "a")', 'Compile error'], 'Tuple fields are accessed by position: .0, .1, …'],
];

export const medium = [
  ['ownership', 'What happens?', 'let a = String::from("x");\nlet b = a;\nprintln!("{}", a);', ['Compile error: a was moved into b', 'It prints x', 'It prints an empty line', 'It crashes at runtime'], 'Assigning a String moves ownership; a can no longer be used. Use a.clone() to keep both.'],
  ['borrowing', 'How many mutable references to the same value can exist at once?', null, ['One, and no immutable ones at the same time', 'As many as you like', 'Two', 'None: Rust has no mutable references'], 'This rule prevents data races at compile time.'],
  ['enums', 'What is printed?', 'let x: Option<i32> = None;\nprintln!("{}", x.unwrap_or(7));', ['7', '0', 'None', 'It panics'], 'unwrap_or gives the default when the Option is None.'],
  ['errors', 'What does .unwrap() do on an Err value?', null, ['It panics and stops the program', 'It returns a default value', 'It returns None', 'It retries the operation'], 'Use unwrap_or, match or ? in real code; unwrap is for quick experiments and tests.'],
  ['collections', 'What is printed?', 'let v = vec![1, 2, 3, 4];\nlet s: i32 = v.iter().filter(|x| *x % 2 == 0).sum();\nprintln!("{}", s);', ['6', '10', '4', 'Compile error'], 'filter keeps 2 and 4 and sum adds them.'],
  ['basics', 'What is printed?', 'let a = 5u8;\nprintln!("{:?}", a.checked_add(251));', ['None', 'Some(256)', 'Some(0)', 'It panics'], '5 + 251 = 256 does not fit in a u8, so checked_add returns None.'],
  ['traits', 'What does #[derive(Debug)] give a struct?', null, ['The ability to print it with {:?}', 'Automatic tests', 'A debugger', 'Faster debug builds'], 'derive generates trait implementations for you.'],
  ['enums', 'What is printed?', 'let n = 3;\nlet s = match n {\n    1 | 2 => "low",\n    3..=5 => "mid",\n    _ => "high",\n};\nprintln!("{}", s);', ['mid', 'low', 'high', 'Compile error'], 'match takes the first arm whose pattern fits.'],
];

export const hard = [
  ['borrowing', 'What is a lifetime annotation like \'a for?', null, ['Telling the compiler how long references must stay valid relative to each other', 'Setting how long a variable lives in seconds', 'Making memory garbage-collected', 'Marking a function as async'], 'Lifetimes describe relationships; they never change how long data actually lives.'],
  ['concurrency', 'Why is shared mutable data often wrapped in Arc<Mutex<T>>?', null, ['Arc shares ownership across threads; Mutex gives safe mutable access', 'It makes the data faster', 'It copies the data to each thread', 'It is required for every variable'], 'Rc and RefCell are single-threaded; Arc and Mutex are their thread-safe versions.'],
  ['ownership', 'What is printed?', 'let s = String::from("hi");\nlet t = s.clone();\nprintln!("{} {}", s, t);', ['hi hi', 'Compile error: s was moved', 'hi', ' hi'], 'clone() makes a deep copy, so both stay valid.'],
  ['traits', 'How do Box<dyn Trait> and impl Trait (as an argument) differ?', null, ['dyn uses dynamic dispatch; impl Trait is resolved at compile time', 'They are identical', 'impl Trait is slower', 'dyn Trait cannot have methods'], 'Generic/impl Trait code is monomorphised; dyn goes through a vtable.'],
  ['errors', 'What is printed?', 'let r: Result<i32, String> = "42".parse::<i32>().map_err(|e| e.to_string());\nprintln!("{:?}", r);', ['Ok(42)', '42', 'Err("42")', 'Some(42)'], 'Parsing succeeds, so the Result is Ok(42); {:?} shows the variant.'],
  ['collections', 'What is printed?', 'use std::collections::HashMap;\nlet mut m = HashMap::new();\n*m.entry("a").or_insert(0) += 2;\nprintln!("{}", m["a"]);', ['2', '0', '1', 'It panics'], 'entry().or_insert(0) creates the key with 0, then += 2 updates it.'],
  ['basics', 'In a debug build, what does 255u8 + 1 do at runtime?', null, ['It panics with an overflow error', 'It wraps to 0', 'It becomes 256', 'It is a compile error in every case'], 'Debug builds check overflow; release builds wrap. Use wrapping_add or checked_add to be explicit.'],
  ['ownership', 'What does Rc<T> provide?', null, ['Shared ownership with reference counting, on one thread', 'Thread-safe shared ownership', 'A mutable borrow', 'A raw pointer'], 'The value is dropped when the last Rc goes away; use Arc across threads.'],
];
