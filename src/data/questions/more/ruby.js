// Extra Ruby questions (IDs continue at rb-easy-17 …).
export const easy = [
  ['basics', 'What does this print?', 'puts 7 / 2', ['3', '3.5', '4', '3.0'], 'Dividing two integers gives an integer in Ruby.'],
  ['strings', 'What does this print?', 'puts "ruby".upcase', ['RUBY', 'Ruby', 'ruby', 'rUBY'], 'upcase returns a new uppercase string.'],
  ['collections', 'What does this print?', 'a = [1, 2, 3]\na << 4\nputs a.length', ['4', '3', '5', '7'], '<< appends to an array.'],
  ['blocks', 'What does this print?', '[1, 2, 3].each { |x| print x }', ['123', '1 2 3', '[1, 2, 3]', '6'], 'print writes without a newline or spaces.'],
  ['control', 'What does this print?', 'x = 5\nputs x > 3 ? "big" : "small"', ['big', 'small', 'true', 'nil'], 'The ternary operator picks "big".'],
  ['strings', 'What does this print?', 'name = "Riya"\nputs "Hi #{name}"', ['Hi Riya', 'Hi #{name}', 'Hi name', 'HiRiya'], '#{} interpolates inside double-quoted strings.'],
  ['collections', 'What does this print?', 'h = { a: 1 }\nh[:b] = 2\nputs h.keys.inspect', ['[:a, :b]', '["a", "b"]', '[1, 2]', '{:a=>1, :b=>2}'], 'Hash keys here are symbols; inspect shows them with colons.'],
  ['basics', 'What does this print?', 'puts 2 ** 3', ['8', '6', '9', '23'], '** is exponentiation.'],
];

export const medium = [
  ['blocks', 'What does this print?', 'puts [1, 2, 3, 4].select(&:even?).inspect', ['[2, 4]', '[1, 3]', 'true', '[false, true, false, true]'], '&:even? turns the method into a block; select keeps items where it is true.'],
  ['blocks', 'What does this print?', 'puts [1, 2, 3].map { |x| x * 2 }.sum', ['12', '6', '[2, 4, 6]', '246'], 'map doubles each item, then sum adds 2 + 4 + 6.'],
  ['oop', 'What does this print?', 'class Dog\n  def initialize(name)\n    @name = name\n  end\n\n  def to_s\n    "Dog #{@name}"\n  end\nend\nputs Dog.new("Max")', ['Dog Max', '#<Dog>', 'Max', 'Dog #{@name}'], 'puts calls to_s, which this class overrides.'],
  ['control', 'What does this print?', 'puts (1..5).step(2).to_a.inspect', ['[1, 3, 5]', '[1, 2, 3, 4, 5]', '[2, 4]', '[1, 3]'], 'step(2) takes every second value of the range.'],
  ['strings', 'What does this print?', 'puts "hello world".split.map(&:capitalize).join(" ")', ['Hello World', 'Hello world', 'HELLO WORLD', 'helloWorld'], 'split breaks on spaces, capitalize fixes each word, join puts them back.'],
  ['collections', 'What does this print?', 'puts [3, 1, 2].sort.reverse.inspect', ['[3, 2, 1]', '[1, 2, 3]', '[2, 1, 3]', '[3, 1, 2]'], 'sort gives [1, 2, 3]; reverse flips it.'],
  ['basics', 'What does this print?', 'x = nil\nputs x || "default"', ['default', 'nil', 'false', 'NoMethodError'], 'nil is falsy, so || returns the right-hand value.'],
  ['blocks', 'What does this print?', 'puts (1..3).reduce(:*)', ['6', '3', '1', '123'], 'reduce(:*) multiplies 1 * 2 * 3.'],
];

export const hard = [
  ['meta', 'What does this print?', 'class Foo\n  def method_missing(name, *args)\n    "called #{name}"\n  end\nend\nputs Foo.new.bar', ['called bar', 'NoMethodError', 'nil', 'called method_missing'], 'method_missing runs for any undefined method and receives its name.'],
  ['oop', 'What does this print?', 'module Greet\n  def hi\n    "hi #{name}"\n  end\nend\n\nclass U\n  include Greet\n  def name\n    "Ana"\n  end\nend\nputs U.new.hi', ['hi Ana', 'hi name', 'NameError', 'hi '], 'include mixes the module methods into the class, and they can call its methods.'],
  ['blocks', 'What does this print?', 'def twice\n  yield\n  yield\nend\nn = 0\ntwice { n += 1 }\nputs n', ['2', '1', '0', 'LocalJumpError'], 'yield runs the block each time; the block can change n because it is a closure.'],
  ['strings', 'What does this print?', 's = "abc".freeze\nbegin\n  s << "d"\nrescue => e\n  puts e.class\nend', ['FrozenError', 'abcd', 'abc', 'TypeError'], 'A frozen string cannot be modified; << raises FrozenError.'],
  ['meta', 'What does this print?', 'puts 5.respond_to?(:+)', ['true', 'false', 'nil', 'NoMethodError'], '+ is an ordinary method on Integer, so 5 responds to it.'],
  ['collections', 'What does this print?', 'h = Hash.new(0)\n"banana".each_char { |c| h[c] += 1 }\nputs h["a"]', ['3', '0', '2', 'nil'], 'Hash.new(0) gives 0 for missing keys, so counting works without setup.'],
  ['control', 'What does this print?', 'puts [1, 2, 3].each_with_index.map { |x, i| x * i }.inspect', ['[0, 2, 6]', '[1, 2, 3]', '[0, 1, 2]', '[1, 4, 9]'], 'Each value is multiplied by its index: 1*0, 2*1, 3*2.'],
  ['oop', 'What does this print?', 'class A\n  def self.make\n    new\n  end\nend\nputs A.make.class', ['A', 'Class', 'NilClass', 'Object'], 'self.make is a class method that returns a new A.'],
];
