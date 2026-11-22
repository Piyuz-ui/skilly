// Ruby question bank (Ruby 3.2+). Row format documented in python.js. Append only.
import { META } from './meta.js';

export const meta = META.ruby;

export const easy = [
  ['basics', 'What does puts "Hi" do?', null, ['Prints Hi followed by a newline', 'Prints Hi without a newline', 'Returns "Hi"', 'Raises an error'], 'puts adds a newline; print does not. puts returns nil.'],
  ['strings', 'How do you insert name into a string?', null, ['"Hi #{name}"', '"Hi ${name}"', '\'Hi #{name}\'', '"Hi {name}"'], 'Interpolation works only in double-quoted strings.'],
  ['collections', 'What does [1, 2, 3].length return?', null, ['3', '2', '4', 'nil'], 'size is an alias.'],
  ['basics', 'What is 7 / 2?', null, ['3', '3.5', '4', 'An error'], 'Integer / Integer is integer division. Use 7.0 / 2 or 7.fdiv(2).'],
  ['collections', 'What does { a: 1 }[:a] return?', null, ['1', 'nil', ':a', 'An error'], 'a: 1 is shorthand for :a => 1.'],
  ['blocks', 'What is printed?', '3.times { print "x" }', ['xxx', 'x', '3x', '012'], 'times yields to the block n times.'],
  ['collections', 'What does (1..3).to_a return?', null, ['[1, 2, 3]', '[1, 2]', '[0, 1, 2, 3]', '1..3'], '.. is an inclusive range.'],
  ['basics', 'What does add(2, 3) return?', 'def add(a, b)\n  a + b\nend', ['5', 'nil', '23', 'An error'], 'Ruby returns the value of the last expression implicitly.'],
  ['strings', 'What does "ruby".upcase return?', null, ['"RUBY"', '"Ruby"', '"ruby"', 'nil'], 'upcase returns a new string.'],
  ['control', 'What is printed?', 'if 0\n  puts "yes"\nelse\n  puts "no"\nend', ['yes', 'no', 'An error', 'Nothing'], 'Only nil and false are falsy in Ruby. 0 and "" are truthy.'],
  ['strings', 'What is :name?', null, ['A symbol — an immutable, reusable identifier', 'A string', 'A method call', 'A comment'], 'Symbols are often used as hash keys.'],
  ['blocks', 'What is printed?', '[1, 2].each { |x| print x }', ['12', '[1, 2]', '3', '1 2'], 'each yields each element to the block.'],
  ['control', 'When does the body of unless done run?', null, ['When done is falsy', 'When done is truthy', 'Always', 'Never'], 'unless is the inverse of if.'],
  ['collections', 'What is a afterwards?', 'a = [1, 2]\na << 3', ['[1, 2, 3]', '[3, 1, 2]', '[1, 2]', 'An error'], '<< appends to an array.'],
  ['collections', 'What does [].empty? return?', null, ['true', 'false', 'nil', '0'], 'By convention, methods ending in ? return a boolean.'],
  ['basics', 'Which command installs a Ruby library?', null, ['gem install', 'npm install', 'pip install', 'ruby add'], 'Bundler manages a project’s gems through a Gemfile.'],
];

export const medium = [
  ['blocks', 'What does [1, 2, 3].map { |x| x * 2 } return?', null, ['[2, 4, 6]', '[1, 2, 3]', '12', 'nil'], 'map returns a new array.'],
  ['blocks', 'What does (1..6).select(&:even?) return?', null, ['[2, 4, 6]', '[1, 3, 5]', 'true', '[true, false, …]'], '&:even? turns the symbol into a block that calls even?.'],
  ['blocks', 'What does [1, 2, 3].reduce(:+) return?', null, ['6', '[1, 2, 3]', '123', 'nil'], 'reduce (alias inject) folds with the given method.'],
  ['strings', 'How do s.upcase and s.upcase! differ?', null, ['upcase! changes s in place; upcase returns a new string', 'They are identical', 'upcase! raises if lowercase', 'upcase! returns a boolean'], 'Bang methods are the more surprising (usually mutating) version.'],
  ['oop', 'What does attr_accessor :name generate?', null, ['name and name= methods', 'A class variable', 'A constant', 'Only a reader'], 'attr_reader and attr_writer generate one side each.'],
  ['strings', 'What is a afterwards (without frozen string literals)?', 'a = "hi"\nb = a\nb << "!"', ['"hi!"', '"hi"', 'nil', 'An error'], 'a and b reference the same string object, and << mutates it.'],
  ['collections', 'What is h[:x] afterwards?', 'h = Hash.new(0)\nh[:x] += 1', ['1', 'nil', '0', 'An error'], 'Hash.new(0) returns 0 for missing keys, which is handy for counting.'],
  ['control', 'Which keywords handle exceptions?', null, ['begin / rescue / ensure', 'try / catch / finally', 'do / except / always', 'guard / else'], 'ensure always runs, like finally.'],
  ['blocks', 'What does yield do inside a method?', null, ['Calls the block passed to the method', 'Returns early', 'Pauses a thread', 'Raises an error'], 'Use block_given? to check whether a block was passed.'],
  ['oop', 'What does @count inside an instance method refer to?', null, ['An instance variable of that object', 'A class variable', 'A global', 'A local variable'], '@@ is a class variable and $ is a global.'],
  ['oop', 'How do you inherit from Animal?', null, ['class Dog < Animal', 'class Dog extends Animal', 'class Dog : Animal', 'class Dog(Animal)'], 'Ruby has single inheritance plus module mixins.'],
  ['oop', 'What does include Comparable inside a class do?', null, ['Mixes the module’s instance methods into the class', 'Inherits from Comparable', 'Imports a file', 'Defines a constant'], 'Modules are Ruby’s way of sharing behaviour.'],
  ['collections', 'What does (1...3).to_a return?', null, ['[1, 2]', '[1, 2, 3]', '[2, 3]', '[]'], 'Three dots exclude the end.'],
  ['basics', 'What does nil&.length return?', null, ['nil', '0', 'NoMethodError', 'false'], '&. is the safe-navigation operator.'],
  ['control', 'What is printed?', 'case 5\nwhen 1..3 then puts "low"\nwhen 4..10 then puts "mid"\nend', ['mid', 'low', 'Nothing', 'An error'], 'case/when uses ===, which tests range membership.'],
  ['strings', 'With # frozen_string_literal: true, what does "a" << "b" do?', null, ['Raises FrozenError', 'Returns "ab"', 'Returns "a"', 'Prints a warning'], 'The magic comment freezes string literals in that file.'],
];

export const hard = [
  ['collections', 'What is h[:b]?', 'h = Hash.new([])\nh[:a] << 1', ['[1]', '[]', 'nil', 'An error'], 'Every missing key returns the same default array, and << mutated it. Use Hash.new { |hash, k| hash[k] = [] }.'],
  ['meta', 'When is method_missing called?', null, ['When an object receives a message it has no method for', 'At class definition', 'On every call', 'When a method raises'], 'Pair it with respond_to_missing?.'],
  ['blocks', 'How does return inside a lambda differ from return inside a proc?', null, ['In a lambda it returns from the lambda; in a proc it returns from the enclosing method', 'They are identical', 'Procs cannot return', 'Lambdas cannot return'], 'Lambdas behave like methods.'],
  ['blocks', 'What happens?', 'l = lambda { |a, b| [a, b] }\nl.call(1)', ['ArgumentError', '[1, nil]', '[1]', 'nil'], 'Lambdas check arity strictly. A proc would fill b with nil.'],
  ['meta', 'What does define_method(:greet) { "hi" } do inside a class?', null, ['Defines an instance method greet at runtime', 'Calls greet', 'Defines a class method', 'Raises an error'], 'Useful for generating methods from data.'],
  ['meta', 'How do obj.send(:secret) and obj.public_send(:secret) differ for a private method?', null, ['send calls it; public_send raises NoMethodError', 'Both call it', 'Both raise', 'public_send calls it'], 'send bypasses visibility.'],
  ['oop', 'What does def self.build inside a class define?', null, ['A class method', 'An instance method', 'A module function', 'A constant'], 'class << self … end is another way.'],
  ['oop', 'What must a class define to use Comparable?', null, ['<=>', '==', 'each', 'hash'], 'Comparable builds <, >, between? and clamp on top of <=>.'],
  ['oop', 'What must a class define to use Enumerable?', null, ['each', 'map', '<=>', 'size'], 'map, select, sort and many more are built on each.'],
  ['basics', 'What do 1 == 1.0 and 1.eql?(1.0) return?', null, ['true and false', 'true and true', 'false and false', 'false and true'], 'eql? also compares types. Hash keys use eql?.'],
  ['strings', 'What happens?', 'arr = ["a"].freeze\narr[0] << "b"', ['It works — freeze is shallow, so arr is ["ab"]', 'FrozenError', 'arr becomes ["a", "b"]', 'A syntax error'], 'freeze stops changes to the array, not to the objects inside it.'],
  ['meta', 'In CRuby, why don’t threads speed up CPU-bound Ruby code?', null, ['The GVL lets only one thread run Ruby code at a time', 'Threads are not supported', 'Threads are fibers', 'They do speed it up'], 'Use processes or Ractors for CPU parallelism. Threads still help with I/O.'],
  ['collections', 'What does this return?', '(1..Float::INFINITY).lazy.map { _1 * 2 }.first(3)', ['[2, 4, 6]', 'It runs forever', '[1, 2, 3]', 'An error'], 'lazy builds elements only on demand.'],
  ['meta', 'Where does a refinement activated with using apply?', null, ['Only in the file or module scope where using is called', 'Globally', 'Only in tests', 'Only to subclasses'], 'Refinements are a scoped alternative to monkey-patching.'],
  ['oop', 'Inside an overriding method, what does super with no parentheses pass?', null, ['The same arguments the current method received', 'No arguments', 'Only the first argument', 'Only the block'], 'super() passes none explicitly.'],
  ['meta', 'What does obj.instance_variable_get(:@name) do?', null, ['Reads the @name instance variable directly, bypassing accessors', 'Calls name', 'Defines @name', 'Raises unless public'], 'Reflection is powerful but breaks encapsulation.'],
];
