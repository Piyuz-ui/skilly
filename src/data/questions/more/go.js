// Extra Go questions (IDs continue at go-easy-17 …).
export const easy = [
  ['basics', 'What is printed?', 'fmt.Println(7 / 2)', ['3', '3.5', '4', '3.0'], 'Integer division truncates.'],
  ['basics', 'What is printed?', 'x := 5\nx++\nfmt.Println(x)', ['6', '5', '7', 'Compile error'], 'x++ is a statement that adds 1.'],
  ['slices', 'What is printed?', 's := []int{1, 2, 3}\ns = append(s, 4)\nfmt.Println(len(s))', ['4', '3', '5', 'Compile error'], 'append returns the longer slice, which must be assigned back.'],
  ['basics', 'What is the zero value of a string in Go?', null, ['"" (empty string)', 'nil', '"0"', 'undefined'], 'Every type has a zero value: 0, false, "" or nil.'],
  ['slices', 'What is printed?', 'fmt.Println([]int{10, 20, 30}[1:])', ['[20 30]', '[10 20]', '[10]', '20'], 'A slice expression [1:] starts at index 1.'],
  ['functions', 'What is printed?', 'func swap(a, b int) (int, int) { return b, a }\n// …\nx, y := swap(1, 2)\nfmt.Println(x, y)', ['2 1', '1 2', '[2 1]', 'Compile error'], 'Go functions can return several values.'],
  ['types', 'What is printed?', 'm := map[string]int{"a": 1}\nfmt.Println(m["z"])', ['0', 'nil', 'panic', 'false'], 'Reading a missing key returns the zero value.'],
  ['concurrency', 'Which keyword starts a function concurrently?', null, ['go', 'async', 'spawn', 'thread'], 'go f() starts f in a new goroutine.'],
];

export const medium = [
  ['errors', 'How do Go functions usually report failure?', null, ['By returning an error as the last value', 'By throwing exceptions', 'By returning -1', 'By calling exit()'], 'Callers check if err != nil.'],
  ['pointers', 'What is printed?', 'func inc(p *int) { *p++ }\n// …\nn := 1\ninc(&n)\nfmt.Println(n)', ['2', '1', 'An address', 'Compile error'], 'inc receives a pointer and changes the value it points to.'],
  ['slices', 'What is printed?', 'a := []int{1, 2, 3}\nb := a\nb[0] = 9\nfmt.Println(a[0])', ['9', '1', '0', 'panic'], 'Slices share the same underlying array; copy() makes an independent copy.'],
  ['types', 'What is printed?', 'v, ok := map[string]int{"a": 1}["b"]\nfmt.Println(v, ok)', ['0 false', '0 true', 'nil false', '1 true'], 'The "comma ok" form tells a missing key apart from a stored zero.'],
  ['functions', 'What is printed by main?', 'func main() {\n  defer fmt.Print("1")\n  fmt.Print("2")\n}', ['21', '12', '1', '2'], 'Deferred calls run when the function returns.'],
  ['types', 'How does a type implement an interface in Go?', null, ['Just by having the interface’s methods', 'With the implements keyword', 'By embedding the interface', 'By registering it at startup'], 'Interfaces are satisfied implicitly.'],
  ['slices', 'What is printed?', 's := make([]int, 2, 5)\nfmt.Println(len(s), cap(s))', ['2 5', '5 2', '2 2', '5 5'], 'make([]T, len, cap) sets both length and capacity.'],
  ['concurrency', 'What happens when you send on an unbuffered channel?', null, ['It blocks until a receiver takes the value', 'It returns immediately', 'It drops the value if no one is listening', 'It panics'], 'Unbuffered channels synchronise sender and receiver.'],
];

export const hard = [
  ['concurrency', 'What is a sync.WaitGroup for?', null, ['Waiting for a group of goroutines to finish', 'Locking shared data', 'Sending values between goroutines', 'Limiting CPU use'], 'Add before starting, Done when each finishes, Wait to block until all are done.'],
  ['errors', 'What does errors.Is(err, target) check?', null, ['Whether err or any error it wraps matches target', 'Whether err is nil', 'Whether the messages are equal', 'Whether both have the same type name'], 'It follows the chain created with fmt.Errorf("…%w", err).'],
  ['functions', 'What is printed?', 'for i := 0; i < 3; i++ {\n  defer fmt.Print(i)\n}', ['210', '012', '333', '222'], 'Deferred calls run last-in, first-out; arguments are evaluated when defer runs.'],
  ['types', 'A function returns a nil *MyErr as type error. Is err == nil?', null, ['No: the interface holds a typed nil, so it is not nil', 'Yes, always', 'It panics', 'Only if MyErr is a struct'], 'An interface is nil only when both its type and value are nil. Return a plain nil instead.'],
  ['generics', 'What is printed?', 'func Max[T int | float64](a, b T) T {\n  if a > b {\n    return a\n  }\n  return b\n}\n// …\nfmt.Println(Max(2, 5))', ['5', '2', '7', 'Compile error'], 'T is inferred as int from the arguments.'],
  ['concurrency', 'In a select with a default case, what happens when no channel is ready?', null, ['The default case runs immediately', 'It blocks forever', 'It panics', 'It picks a channel at random'], 'default makes select non-blocking.'],
  ['slices', 'What is printed?', 's := []int{1, 2, 3}\nt := s[:1]\nt = append(t, 9)\nfmt.Println(s)', ['[1 9 3]', '[1 2 3]', '[1 9]', '[1 2 3 9]'], 't has spare capacity in the same array, so append overwrites s[1].'],
  ['pointers', 'Can a Go function safely return a pointer to a local variable?', null, ['Yes: escape analysis moves it to the heap', 'No: it is freed when the function returns', 'Only for structs', 'Only with new()'], 'Go’s compiler keeps the variable alive as long as it is referenced.'],
];
