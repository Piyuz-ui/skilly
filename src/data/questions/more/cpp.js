// Extra C++ questions (IDs continue at cpp-easy-17 …).
export const easy = [
  ['basics', 'What does this print?', 'int a = 7, b = 2;\ncout << a / b << " " << a % b;', ['3 1', '3.5 1', '3 0', '4 1'], 'Dividing two ints truncates: 7 / 2 is 3, remainder 1.'],
  ['control', 'What does this print?', 'for (int i = 0; i < 3; i++) cout << i;', ['012', '123', '0123', '0 1 2'], 'The loop runs for i = 0, 1, 2 with no separator.'],
  ['basics', 'What does this print?', 'cout << sizeof(char);', ['1', '2', '4', '8'], 'sizeof(char) is 1 by definition.'],
  ['stl', 'What does this print?', 'vector<int> v = {1, 2, 3};\nv.push_back(4);\ncout << v.size();', ['4', '3', '5', '16'], 'push_back adds one element to the end.'],
  ['basics', 'What does this print?', 'string s = "hi";\ns += "!";\ncout << s.length();', ['3', '2', '4', '1'], 'Appending "!" makes "hi!", which has 3 characters.'],
  ['control', 'What does this print?', 'int x = 5;\ncout << (x > 3 ? "yes" : "no");', ['yes', 'no', '1', '5'], 'The conditional operator picks "yes" because 5 > 3.'],
  ['pointers', 'What does this print?', 'int x = 10;\nint* p = &x;\n*p = 20;\ncout << x;', ['20', '10', 'The address of x', '0'], '*p refers to x itself, so assigning through it changes x.'],
  ['functions', 'What does this print?', '#include <iostream>\nusing namespace std;\nvoid inc(int n) { n++; }\nint main() {\n  int a = 1;\n  inc(a);\n  cout << a;\n}', ['1', '2', '0', 'Compile error'], 'n is a copy (pass by value), so a does not change.'],
];

export const medium = [
  ['functions', 'What does this print?', '#include <iostream>\nusing namespace std;\nvoid inc(int& n) { n++; }\nint main() {\n  int a = 1;\n  inc(a);\n  cout << a;\n}', ['2', '1', '0', 'Compile error'], 'int& is a reference, so inc changes the caller\'s variable.'],
  ['stl', 'What does this print?', 'map<string, int> m;\nm["b"] = 2;\nm["a"] = 1;\nfor (auto& [k, v] : m) cout << k;', ['ab', 'ba', '21', '12'], 'std::map keeps keys sorted, so "a" comes first.'],
  ['stl', 'What does this print?', 'vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end());\ncout << v[0] << v[2];', ['13', '31', '12', '32'], 'After sorting, v is {1, 2, 3}.'],
  ['oop', 'What does this print?', '#include <iostream>\nusing namespace std;\nstruct A {\n  A() { cout << "A"; }\n  ~A() { cout << "~A"; }\n};\nint main() {\n  { A a; }\n  cout << "!";\n}', ['A~A!', 'A!~A', '!A~A', 'A!'], 'The destructor runs when a leaves its block, before "!" is printed.'],
  ['pointers', 'What does this print?', 'int arr[] = {10, 20, 30};\nint* p = arr;\np++;\ncout << *p;', ['20', '10', '11', '30'], 'Incrementing a pointer moves it to the next element.'],
  ['memory', 'Without smart pointers, what must every new be paired with?', null, ['A matching delete', 'free()', 'Nothing: C++ has garbage collection', 'A destructor call written by hand'], 'Memory from new must be released with delete (new[] with delete[]). Prefer unique_ptr so this happens automatically.'],
  ['stl', 'What does this print?', 'string s = "hello";\ncout << s.substr(1, 3);', ['ell', 'el', 'ello', 'hel'], 'substr(pos, count) takes 3 characters starting at index 1.'],
  ['templates', 'What does this print?', '#include <iostream>\nusing namespace std;\ntemplate <typename T> T maxOf(T a, T b) { return a > b ? a : b; }\nint main() {\n  cout << maxOf(3, 7) << maxOf<double>(2.5, 1);\n}', ['72.5', '73', '7 2.5', 'Compile error'], 'The template is instantiated for int and for double.'],
];

export const hard = [
  ['oop', 'What does this print?', '#include <iostream>\n#include <string>\nusing namespace std;\nstruct B { virtual string name() { return "B"; } };\nstruct D : B { string name() override { return "D"; } };\nint main() {\n  D d;\n  B& b = d;\n  cout << b.name();\n}', ['D', 'B', 'BD', 'Compile error'], 'name is virtual, so the call goes to the real (dynamic) type, D.'],
  ['oop', 'What does this print?', '#include <iostream>\n#include <string>\nusing namespace std;\nstruct B { string name() { return "B"; } };\nstruct D : B { string name() { return "D"; } };\nint main() {\n  D d;\n  B& b = d;\n  cout << b.name();\n}', ['B', 'D', 'BD', 'Compile error'], 'Without virtual, the call uses the static type of the reference, B.'],
  ['memory', 'What does this print?', '#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n  auto p = make_unique<int>(5);\n  auto q = move(p);\n  cout << (p == nullptr) << *q;\n}', ['15', '05', '55', 'Compile error'], 'Moving a unique_ptr transfers ownership; p becomes null (1 = true) and q owns 5.'],
  ['ub', 'Reading an int local variable that was never initialised is…', null, ['Undefined behaviour', 'Always 0', 'A compile error', 'Always the previous value of that memory'], 'Uninitialised locals have indeterminate values; reading them is undefined behaviour.'],
  ['stl', 'What does this print?', 'vector<int> v = {1, 2, 3, 4};\nv.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());\ncout << v.size();', ['2', '4', '0', '3'], 'The erase-remove idiom deletes the even numbers, leaving {1, 3}.'],
  ['templates', 'When is the code for a function template generated?', null, ['At compile time, when it is used with specific types', 'At runtime, on the first call', 'Once for all types when the header is included', 'Only if marked inline'], 'Each instantiation (e.g. maxOf<int>) is generated by the compiler where it is used.'],
  ['memory', 'What does this print?', '#include <iostream>\n#include <memory>\nusing namespace std;\nint main() {\n  auto a = make_shared<int>(1);\n  auto b = a;\n  cout << a.use_count();\n}', ['2', '1', '0', '3'], 'Two shared_ptrs now share ownership of the same int.'],
  ['basics', 'What does this print?', 'int a = 5;\ncout << (a << 1) << " " << (a >> 1);', ['10 2', '2 10', '5 5', '10 3'], 'Shifting left by 1 doubles (10); shifting right by 1 halves and drops the remainder (2).'],
];
