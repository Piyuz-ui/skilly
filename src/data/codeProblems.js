// Coding practice problems. Each runs in the browser against test cases.
//   fn:       function name per language (js / py)
//   tests:    [{ args: [...], expect }]. The first `shown` tests are visible
//             as examples; the rest are hidden checks.
//   solution: reference answers, used by scripts/check-code-problems.mjs to
//             prove every test is correct (never shown before solving).
// Inputs and outputs are JSON-friendly (numbers, strings, booleans, lists).

export const CODE_LANGS = [
  { id: 'py', label: 'Python', file: 'solution.py' },
  { id: 'js', label: 'JavaScript', file: 'solution.js' },
];

const P = (o) => ({ shown: 2, ...o });

export const PROBLEMS = [
  P({
    id: 'sum-list', title: 'Sum of a list', level: 'easy', topic: 'Arrays',
    prompt: 'Return the sum of all numbers in the list. An empty list sums to 0.',
    fn: { js: 'sumList', py: 'sum_list' },
    tests: [{ args: [[1, 2, 3]], expect: 6 }, { args: [[]], expect: 0 }, { args: [[-5, 5, 10]], expect: 10 }, { args: [[100]], expect: 100 }],
    solution: { js: 'function sumList(nums) { return nums.reduce((a, b) => a + b, 0); }', py: 'def sum_list(nums):\n    return sum(nums)' },
  }),
  P({
    id: 'reverse-string', title: 'Reverse a string', level: 'easy', topic: 'Strings',
    prompt: 'Return the string reversed.',
    fn: { js: 'reverseString', py: 'reverse_string' },
    tests: [{ args: ['hello'], expect: 'olleh' }, { args: [''], expect: '' }, { args: ['a'], expect: 'a' }, { args: ['Skilly 2026'], expect: '6202 yllikS' }],
    solution: { js: "function reverseString(s) { return [...s].reverse().join(''); }", py: 'def reverse_string(s):\n    return s[::-1]' },
  }),
  P({
    id: 'fizzbuzz', title: 'FizzBuzz', level: 'easy', topic: 'Loops',
    prompt: 'Return a list of strings for 1..n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, otherwise the number as a string.',
    fn: { js: 'fizzBuzz', py: 'fizz_buzz' },
    tests: [{ args: [5], expect: ['1', '2', 'Fizz', '4', 'Buzz'] }, { args: [1], expect: ['1'] }, { args: [15], expect: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] }, { args: [0], expect: [] }],
    solution: {
      js: "function fizzBuzz(n) { const out = []; for (let i = 1; i <= n; i++) out.push(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : String(i)); return out; }",
      py: "def fizz_buzz(n):\n    out = []\n    for i in range(1, n + 1):\n        out.append('FizzBuzz' if i % 15 == 0 else 'Fizz' if i % 3 == 0 else 'Buzz' if i % 5 == 0 else str(i))\n    return out",
    },
  }),
  P({
    id: 'palindrome', title: 'Valid palindrome', level: 'easy', topic: 'Strings',
    prompt: 'Return true if the string reads the same forwards and backwards, ignoring case and any character that is not a letter or digit.',
    fn: { js: 'isPalindrome', py: 'is_palindrome' },
    tests: [{ args: ['A man, a plan, a canal: Panama'], expect: true }, { args: ['race a car'], expect: false }, { args: [''], expect: true }, { args: ['No lemon, no melon'], expect: true }, { args: ['ab'], expect: false }],
    solution: {
      js: "function isPalindrome(s) { const t = s.toLowerCase().replace(/[^a-z0-9]/g, ''); return t === [...t].reverse().join(''); }",
      py: "def is_palindrome(s):\n    t = ''.join(c.lower() for c in s if c.isalnum())\n    return t == t[::-1]",
    },
  }),
  P({
    id: 'count-vowels', title: 'Count vowels', level: 'easy', topic: 'Strings',
    prompt: 'Return how many vowels (a, e, i, o, u, in either case) the string contains.',
    fn: { js: 'countVowels', py: 'count_vowels' },
    tests: [{ args: ['hello'], expect: 2 }, { args: ['RHYTHM'], expect: 0 }, { args: ['AEIOU aeiou'], expect: 10 }, { args: [''], expect: 0 }],
    solution: { js: "function countVowels(s) { return (s.match(/[aeiou]/gi) || []).length; }", py: "def count_vowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')" },
  }),
  P({
    id: 'second-largest', title: 'Second largest', level: 'easy', topic: 'Arrays',
    prompt: 'Return the second largest distinct number in the list, or null (None in Python) if there is none.',
    fn: { js: 'secondLargest', py: 'second_largest' },
    tests: [{ args: [[3, 1, 4, 1, 5]], expect: 4 }, { args: [[7, 7, 7]], expect: null }, { args: [[2]], expect: null }, { args: [[-1, -3, -2]], expect: -2 }, { args: [[10, 9]], expect: 9 }],
    solution: {
      js: 'function secondLargest(nums) { const u = [...new Set(nums)].sort((a, b) => b - a); return u.length > 1 ? u[1] : null; }',
      py: 'def second_largest(nums):\n    u = sorted(set(nums), reverse=True)\n    return u[1] if len(u) > 1 else None',
    },
  }),
  P({
    id: 'factorial', title: 'Factorial', level: 'easy', topic: 'Recursion',
    prompt: 'Return n! (n factorial) for 0 ≤ n ≤ 15. Remember 0! = 1.',
    fn: { js: 'factorial', py: 'factorial' },
    tests: [{ args: [5], expect: 120 }, { args: [0], expect: 1 }, { args: [1], expect: 1 }, { args: [10], expect: 3628800 }, { args: [15], expect: 1307674368000 }],
    solution: { js: 'function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }', py: 'def factorial(n):\n    r = 1\n    for i in range(2, n + 1):\n        r *= i\n    return r' },
  }),
  P({
    id: 'fibonacci', title: 'Nth Fibonacci number', level: 'easy', topic: 'Dynamic programming',
    prompt: 'Return the nth Fibonacci number, where fib(0) = 0 and fib(1) = 1, for 0 ≤ n ≤ 60. Make it fast: a naive recursive solution is too slow for n = 60.',
    fn: { js: 'fib', py: 'fib' },
    tests: [{ args: [10], expect: 55 }, { args: [0], expect: 0 }, { args: [1], expect: 1 }, { args: [30], expect: 832040 }, { args: [60], expect: 1548008755920 }],
    solution: { js: 'function fib(n) { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; }', py: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a' },
  }),
  P({
    id: 'is-prime', title: 'Prime check', level: 'easy', topic: 'Maths',
    prompt: 'Return true if n is a prime number. Numbers below 2 are not prime. n can be up to 1,000,000,007.',
    fn: { js: 'isPrime', py: 'is_prime' },
    tests: [{ args: [7], expect: true }, { args: [1], expect: false }, { args: [2], expect: true }, { args: [91], expect: false }, { args: [1000000007], expect: true }, { args: [0], expect: false }],
    solution: {
      js: 'function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }',
      py: 'def is_prime(n):\n    if n < 2:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True',
    },
  }),
  P({
    id: 'missing-number', title: 'Missing number', level: 'easy', topic: 'Arrays',
    prompt: 'The list holds n distinct numbers taken from 0..n. Return the one number in that range that is missing.',
    fn: { js: 'missingNumber', py: 'missing_number' },
    tests: [{ args: [[3, 0, 1]], expect: 2 }, { args: [[0, 1]], expect: 2 }, { args: [[1]], expect: 0 }, { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expect: 8 }],
    solution: { js: 'function missingNumber(nums) { const n = nums.length; return n * (n + 1) / 2 - nums.reduce((a, b) => a + b, 0); }', py: 'def missing_number(nums):\n    n = len(nums)\n    return n * (n + 1) // 2 - sum(nums)' },
  }),
  P({
    id: 'remove-duplicates', title: 'Remove duplicates', level: 'easy', topic: 'Hashing',
    prompt: 'Return a new list with duplicates removed, keeping the first occurrence of each value in its original order.',
    fn: { js: 'removeDuplicates', py: 'remove_duplicates' },
    tests: [{ args: [[1, 2, 2, 3, 1]], expect: [1, 2, 3] }, { args: [[]], expect: [] }, { args: [['b', 'a', 'b']], expect: ['b', 'a'] }, { args: [[5, 5, 5, 5]], expect: [5] }],
    solution: { js: 'function removeDuplicates(items) { return [...new Set(items)]; }', py: 'def remove_duplicates(items):\n    seen, out = set(), []\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out' },
  }),
  P({
    id: 'two-sum', title: 'Two sum', level: 'medium', topic: 'Hashing',
    prompt: 'Return the indices [i, j] (with i < j) of the two numbers that add up to target. Exactly one answer exists. Aim for O(n) with a hash map.',
    fn: { js: 'twoSum', py: 'two_sum' },
    tests: [{ args: [[2, 7, 11, 15], 9], expect: [0, 1] }, { args: [[3, 2, 4], 6], expect: [1, 2] }, { args: [[3, 3], 6], expect: [0, 1] }, { args: [[-1, -2, -3, -4, -5], -8], expect: [2, 4] }],
    solution: {
      js: 'function twoSum(nums, target) { const seen = new Map(); for (let j = 0; j < nums.length; j++) { const i = seen.get(target - nums[j]); if (i !== undefined) return [i, j]; seen.set(nums[j], j); } return []; }',
      py: 'def two_sum(nums, target):\n    seen = {}\n    for j, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], j]\n        seen[x] = j\n    return []',
    },
  }),
  P({
    id: 'anagram', title: 'Valid anagram', level: 'easy', topic: 'Hashing',
    prompt: 'Return true if t is an anagram of s (same letters, same counts). Both are lowercase letters only.',
    fn: { js: 'isAnagram', py: 'is_anagram' },
    tests: [{ args: ['anagram', 'nagaram'], expect: true }, { args: ['rat', 'car'], expect: false }, { args: ['', ''], expect: true }, { args: ['aab', 'abb'], expect: false }],
    solution: { js: "function isAnagram(s, t) { return [...s].sort().join('') === [...t].sort().join(''); }", py: 'def is_anagram(s, t):\n    return sorted(s) == sorted(t)' },
  }),
  P({
    id: 'valid-brackets', title: 'Valid brackets', level: 'medium', topic: 'Stacks',
    prompt: 'The string contains only ()[]{}. Return true if every bracket is closed by the same type in the correct order.',
    fn: { js: 'isValid', py: 'is_valid' },
    tests: [{ args: ['()[]{}'], expect: true }, { args: ['(]'], expect: false }, { args: ['([{}])'], expect: true }, { args: ['(('], expect: false }, { args: [''], expect: true }, { args: ['([)]'], expect: false }, { args: [')('], expect: false }],
    solution: {
      js: "function isValid(s) { const st = [], pair = { ')': '(', ']': '[', '}': '{' }; for (const c of s) { if (pair[c]) { if (st.pop() !== pair[c]) return false; } else st.push(c); } return st.length === 0; }",
      py: "def is_valid(s):\n    st, pair = [], {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in pair:\n            if not st or st.pop() != pair[c]:\n                return False\n        else:\n            st.append(c)\n    return not st",
    },
  }),
  P({
    id: 'max-subarray', title: 'Maximum subarray sum', level: 'medium', topic: 'Dynamic programming',
    prompt: 'Return the largest sum of any non-empty contiguous part of the list (Kadane’s algorithm).',
    fn: { js: 'maxSubarray', py: 'max_subarray' },
    tests: [{ args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expect: 6 }, { args: [[1]], expect: 1 }, { args: [[-3, -1, -2]], expect: -1 }, { args: [[5, 4, -1, 7, 8]], expect: 23 }],
    solution: {
      js: 'function maxSubarray(nums) { let best = nums[0], cur = nums[0]; for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); } return best; }',
      py: 'def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best',
    },
  }),
  P({
    id: 'binary-search', title: 'Binary search', level: 'medium', topic: 'Searching',
    prompt: 'The list is sorted in ascending order with distinct values. Return the index of target, or -1 if it is not there. Use O(log n).',
    fn: { js: 'binarySearch', py: 'binary_search' },
    tests: [{ args: [[-1, 0, 3, 5, 9, 12], 9], expect: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expect: -1 }, { args: [[], 1], expect: -1 }, { args: [[5], 5], expect: 0 }, { args: [[1, 3, 5, 7, 9, 11, 13], 1], expect: 0 }, { args: [[1, 3, 5, 7, 9, 11, 13], 13], expect: 6 }],
    solution: {
      js: 'function binarySearch(nums, target) { let lo = 0, hi = nums.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (nums[mid] === target) return mid; if (nums[mid] < target) lo = mid + 1; else hi = mid - 1; } return -1; }',
      py: 'def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1',
    },
  }),
  P({
    id: 'merge-sorted', title: 'Merge two sorted lists', level: 'medium', topic: 'Two pointers',
    prompt: 'Both lists are sorted ascending. Return one sorted list containing every element of both. Try two pointers rather than sorting again.',
    fn: { js: 'mergeSorted', py: 'merge_sorted' },
    tests: [{ args: [[1, 3, 5], [2, 4, 6]], expect: [1, 2, 3, 4, 5, 6] }, { args: [[], [1, 2]], expect: [1, 2] }, { args: [[1, 1], [1]], expect: [1, 1, 1] }, { args: [[], []], expect: [] }, { args: [[0, 10], [5]], expect: [0, 5, 10] }],
    solution: {
      js: 'function mergeSorted(a, b) { const out = []; let i = 0, j = 0; while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]); return out.concat(a.slice(i), b.slice(j)); }',
      py: 'def merge_sorted(a, b):\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]',
    },
  }),
  P({
    id: 'rotate-array', title: 'Rotate a list', level: 'medium', topic: 'Arrays',
    prompt: 'Return a new list rotated to the right by k steps. k can be larger than the list length.',
    fn: { js: 'rotate', py: 'rotate' },
    tests: [{ args: [[1, 2, 3, 4, 5], 2], expect: [4, 5, 1, 2, 3] }, { args: [[1, 2], 3], expect: [2, 1] }, { args: [[], 4], expect: [] }, { args: [[1, 2, 3], 0], expect: [1, 2, 3] }, { args: [[1, 2, 3], 3], expect: [1, 2, 3] }],
    solution: {
      js: 'function rotate(nums, k) { const n = nums.length; if (!n) return []; k %= n; return nums.slice(n - k).concat(nums.slice(0, n - k)); }',
      py: 'def rotate(nums, k):\n    n = len(nums)\n    if not n:\n        return []\n    k %= n\n    return nums[n - k:] + nums[:n - k]',
    },
  }),
  P({
    id: 'word-frequency', title: 'Most frequent word', level: 'medium', topic: 'Hashing',
    prompt: 'Words are separated by spaces; compare them in lowercase. Return the most frequent word. If several tie, return the one that appears first in the text.',
    fn: { js: 'mostFrequent', py: 'most_frequent' },
    tests: [{ args: ['the cat and the hat'], expect: 'the' }, { args: ['b a a b'], expect: 'b' }, { args: ['Hello hello world'], expect: 'hello' }, { args: ['one'], expect: 'one' }],
    solution: {
      js: "function mostFrequent(text) { const words = text.toLowerCase().split(' ').filter(Boolean), c = new Map(); for (const w of words) c.set(w, (c.get(w) || 0) + 1); let best = words[0]; for (const w of words) if (c.get(w) > c.get(best)) best = w; return best; }",
      py: "def most_frequent(text):\n    words = text.lower().split()\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    best = words[0]\n    for w in words:\n        if counts[w] > counts[best]:\n            best = w\n    return best",
    },
  }),
  P({
    id: 'transpose', title: 'Transpose a matrix', level: 'medium', topic: 'Matrices',
    prompt: 'Return the transpose of the matrix (rows become columns). The matrix can be rectangular.',
    fn: { js: 'transpose', py: 'transpose' },
    tests: [{ args: [[[1, 2, 3], [4, 5, 6]]], expect: [[1, 4], [2, 5], [3, 6]] }, { args: [[[1]]], expect: [[1]] }, { args: [[[1, 2], [3, 4]]], expect: [[1, 3], [2, 4]] }, { args: [[[7], [8], [9]]], expect: [[7, 8, 9]] }],
    solution: { js: 'function transpose(m) { return m[0].map((_, c) => m.map((row) => row[c])); }', py: 'def transpose(m):\n    return [list(col) for col in zip(*m)]' },
  }),
];

export const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));

// Starter code shown in the editor.
export function starterCode(problem, lang) {
  const ex = problem.tests[0];
  // Parameter names come from the reference solution's signature.
  const sig = lang === 'py' ? problem.solution.py.match(/def \w+\(([^)]*)\)/) : problem.solution.js.match(/function \w+\(([^)]*)\)/);
  const params = sig ? sig[1] : '';
  if (lang === 'py') {
    return `def ${problem.fn.py}(${params}):\n    # Write your solution here.\n    # Example: ${problem.fn.py}(${ex.args.map((a) => pyRepr(a)).join(', ')}) → ${pyRepr(ex.expect)}\n    pass\n`;
  }
  return `function ${problem.fn.js}(${params}) {\n  // Write your solution here.\n  // Example: ${problem.fn.js}(${ex.args.map((a) => JSON.stringify(a)).join(', ')}) → ${JSON.stringify(ex.expect)}\n}\n`;
}

// Python-style literal for examples: True/False/None and single quotes.
export function pyRepr(v) {
  if (v === null) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(', ')}]`;
  return String(v);
}
