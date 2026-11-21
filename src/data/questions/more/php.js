// Extra PHP questions (IDs continue at php-easy-17 …). PHP 8 behaviour.
export const easy = [
  ['basics', 'What is printed?', 'echo 7 / 2;', ['3.5', '3', '4', '3.0'], 'PHP’s / returns a float when the result is not a whole number. Use intdiv for integer division.'],
  ['strings', 'What is printed?', 'echo "PHP" . " " . "8";', ['PHP 8', 'PHP8', 'PHP + 8', '"PHP" " " "8"'], 'The dot operator joins strings.'],
  ['strings', 'What is printed?', '$name = "Riya";\necho "Hi $name";', ['Hi Riya', 'Hi $name', 'Hi name', 'Hi'], 'Double-quoted strings interpolate variables.'],
  ['strings', 'What is printed?', "\$name = \"Riya\";\necho 'Hi \$name';", ['Hi $name', 'Hi Riya', 'Hi', 'Hi name'], 'Single-quoted strings do not interpolate variables.'],
  ['arrays', 'What is printed?', '$a = [1, 2, 3];\necho count($a);', ['3', '2', '6', '1'], 'count() gives the number of elements.'],
  ['arrays', 'What is printed?', '$a = [1, 2];\n$a[] = 3;\necho end($a);', ['3', '2', '1', 'Array'], '$a[] = adds to the end; end() returns the last element.'],
  ['basics', 'What is printed?', 'echo intdiv(7, 2);', ['3', '3.5', '4', '7'], 'intdiv divides and drops the remainder.'],
  ['web', 'Which superglobal holds query-string values like ?page=2?', null, ['$_GET', '$_POST', '$_SESSION', '$_QUERY'], '$_GET holds URL parameters; $_POST holds form bodies.'],
];

export const medium = [
  ['basics', 'In PHP 8, what does var_dump(0 == "a"); print?', null, ['bool(false)', 'bool(true)', 'int(0)', 'An error'], 'PHP 8 compares a number with a non-numeric string as strings; older PHP said true.'],
  ['basics', 'What does var_dump("1" == "01"); print?', null, ['bool(true)', 'bool(false)', 'string(1) "1"', 'An error'], 'Two numeric strings are compared as numbers with ==. Use === to compare exactly.'],
  ['arrays', 'What is printed?', "\$a = ['b' => 2, 'a' => 1];\nksort(\$a);\necho implode(',', array_keys(\$a));", ['a,b', 'b,a', '1,2', '2,1'], 'ksort sorts by key, in place.'],
  ['functions', 'What is printed?', 'function add(int $a, int $b = 10): int {\n  return $a + $b;\n}\necho add(5);', ['15', '5', '510', 'An error'], 'The default value is used when the argument is left out.'],
  ['strings', 'What does strlen("héllo") return (UTF-8 source)?', null, ['6', '5', '4', '7'], 'strlen counts bytes; é takes 2 bytes in UTF-8. Use mb_strlen for characters.'],
  ['arrays', 'What is printed?', "echo implode(',', array_map(fn(\$x) => \$x * 2, [1, 2, 3]));", ['2,4,6', '1,2,3', '6', '246'], 'array_map applies the arrow function to each element.'],
  ['oop', 'Inside a method, what does $this refer to?', null, ['The current object', 'The class itself', 'The parent class', 'The last created object'], 'Use self:: or static:: for the class rather than an instance.'],
  ['web', 'Why use password_hash() instead of md5() for passwords?', null, ['It uses a slow, salted algorithm made for passwords', 'It is shorter', 'It can be decrypted later', 'md5 is not available in PHP 8'], 'Verify with password_verify(); fast hashes like md5 are easy to brute-force.'],
];

export const hard = [
  ['basics', 'What does var_dump(null ?? "x"); print?', null, ['string(1) "x"', 'NULL', 'bool(false)', 'string(4) "null"'], '?? returns the right side when the left is null or not set.'],
  ['oop', 'In return new static();, what does static refer to?', null, ['The class the method was actually called on (late static binding)', 'Always the class where the method is written', 'A static property', 'The parent class'], 'new self() would always use the defining class instead.'],
  ['errors', 'In PHP 8, what happens when you call a method on null?', null, ['An Error is thrown (“Call to a member function … on null”)', 'It silently returns null', 'A warning is printed and the script continues', 'It returns false'], 'Use the nullsafe operator ?-> when null is expected.'],
  ['arrays', 'What is printed?', "\$a = [1, 2, 3];\nforeach (\$a as &\$v) {\n  \$v *= 2;\n}\nunset(\$v);\necho implode(',', \$a);", ['2,4,6', '1,2,3', '2,4,4', '6'], '&$v loops by reference, so each element is changed. unset($v) avoids a classic bug later.'],
  ['web', 'How do prepared statements (PDO) stop SQL injection?', null, ['Values are sent separately from the SQL and never parsed as SQL', 'They escape quotes with addslashes', 'They block requests from bots', 'They encrypt the database'], 'Always bind user input instead of concatenating it into queries.'],
  ['strings', 'What is printed?', "echo str_pad('7', 3, '0', STR_PAD_LEFT);", ['007', '700', '7', '0007'], 'str_pad pads to the given length on the chosen side.'],
  ['functions', 'What is printed?', '$x = 1;\n$f = function () use ($x) { return $x + 1; };\n$x = 10;\necho $f();', ['2', '11', '1', 'An error'], 'use ($x) copies the value when the closure is created. use (&$x) would capture by reference.'],
  ['oop', 'What is a trait in PHP?', null, ['A reusable set of methods that can be mixed into several classes', 'An interface with constants only', 'A type of exception', 'A database model'], 'Classes add traits with use TraitName;.'],
];
