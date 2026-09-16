import db from "./db.js";

const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    points: 10,
    description: `Given a line of space-separated integers followed by a target on the next line,
print the 0-based indices of the two numbers that add up to the target, space-separated.

Input:
Line 1: space-separated integers (the array)
Line 2: target integer

Output:
Two indices, space-separated (order does not matter for grading, but print lower index first)

Example:
Input:
2 7 11 15
9
Output:
0 1`,
    starter_js: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].trim().split(/\\s+/).map(Number);
const target = parseInt(lines[1].trim(), 10);

function twoSum(nums, target) {
  // TODO: return an array of two indices [i, j] such that nums[i] + nums[j] === target

}

console.log(twoSum(nums, target).join(' '));
`,
    starter_py: `import sys

def two_sum(nums, target):
    # TODO: return a list of two indices [i, j] such that nums[i] + nums[j] == target
    pass

data = sys.stdin.read().strip().split('\\n')
nums = list(map(int, data[0].split()))
target = int(data[1])
print(' '.join(map(str, two_sum(nums, target))))
`,
    tests: [
      { input: "2 7 11 15\n9", output: "0 1", sample: 1 },
      { input: "3 2 4\n6", output: "1 2", sample: 1 },
      { input: "3 3\n6", output: "0 1", sample: 0 },
      { input: "1 5 3 8 2\n10", output: "1 3", sample: 0 },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    points: 5,
    description: `Read a single line string from input and print its reverse.

Example:
Input: hello
Output: olleh`,
    starter_js: `const s = require('fs').readFileSync(0, 'utf8').replace(/\\n$/, '');

function reverseString(str) {
  // TODO: return the reversed string

}

console.log(reverseString(s));
`,
    starter_py: `import sys

def reverse_string(s):
    # TODO: return the reversed string
    pass

s = sys.stdin.readline().rstrip('\\n')
print(reverse_string(s))
`,
    tests: [
      { input: "hello", output: "olleh", sample: 1 },
      { input: "racecar", output: "racecar", sample: 1 },
      { input: "OpenAI", output: "IAnepO", sample: 0 },
      { input: "a", output: "a", sample: 0 },
    ],
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    points: 5,
    description: `Read an integer n. Print numbers 1..n, one per line.
For multiples of 3 print "Fizz", multiples of 5 print "Buzz",
multiples of both print "FizzBuzz", otherwise print the number.`,
    starter_js: `const n = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);

function fizzBuzz(n) {
  // TODO: build and return an array of strings, one per line, per the rules above

}

console.log(fizzBuzz(n).join('\\n'));
`,
    starter_py: `import sys

def fizz_buzz(n):
    # TODO: return a list of strings, one per line, per the rules above
    pass

n = int(sys.stdin.readline().strip())
print('\\n'.join(fizz_buzz(n)))
`,
    tests: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz", sample: 1 },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", sample: 0 },
      { input: "1", output: "1", sample: 0 },
    ],
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Medium",
    points: 15,
    description: `Read a line of text. Considering only alphanumeric characters and ignoring case,
print "true" if it is a palindrome, otherwise print "false".`,
    starter_js: `const s = require('fs').readFileSync(0, 'utf8').replace(/\\n$/, '');

function isPalindrome(str) {
  // TODO: return true or false

}

console.log(isPalindrome(s) ? 'true' : 'false');
`,
    starter_py: `import sys

def is_palindrome(s):
    # TODO: return True or False
    pass

s = sys.stdin.readline().rstrip('\\n')
print('true' if is_palindrome(s) else 'false')
`,
    tests: [
      { input: "A man, a plan, a canal: Panama", output: "true", sample: 1 },
      { input: "race a car", output: "false", sample: 1 },
      { input: "Was it a car or a cat I saw?", output: "true", sample: 0 },
      { input: "hello", output: "false", sample: 0 },
    ],
  },
  {
    slug: "max-subarray",
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    points: 20,
    description: `Given a line of space-separated integers (can be negative), print the
maximum sum of a contiguous subarray (Kadane's algorithm).`,
    starter_js: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);

function maxSubArray(nums) {
  // TODO: return the maximum sum of a contiguous subarray

}

console.log(maxSubArray(nums));
`,
    starter_py: `import sys

def max_sub_array(nums):
    # TODO: return the maximum sum of a contiguous subarray
    pass

nums = list(map(int, sys.stdin.read().strip().split()))
print(max_sub_array(nums))
`,
    tests: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6", sample: 1 },
      { input: "1", output: "1", sample: 1 },
      { input: "5 4 -1 7 8", output: "23", sample: 0 },
      { input: "-1 -2 -3", output: "-1", sample: 0 },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Hard",
    points: 25,
    description: `Line 1: sorted space-separated integers.
Line 2: target integer.
Print the index of the target if found, otherwise print -1. Must run in O(log n).`,
    starter_js: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].trim().split(/\\s+/).map(Number);
const target = parseInt(lines[1].trim(), 10);

function binarySearch(nums, target) {
  // TODO: return the index of target in nums, or -1 if not found. Must run in O(log n).

}

console.log(binarySearch(nums, target));
`,
    starter_py: `import sys

def binary_search(nums, target):
    # TODO: return the index of target in nums, or -1 if not found. Must run in O(log n).
    pass

data = sys.stdin.read().strip().split('\\n')
nums = list(map(int, data[0].split()))
target = int(data[1])
print(binary_search(nums, target))
`,
    tests: [
      { input: "1 3 5 7 9 11\n7", output: "3", sample: 1 },
      { input: "1 2 3 4 5\n10", output: "-1", sample: 1 },
      { input: "2 4 6 8 10 12 14\n2", output: "0", sample: 0 },
      { input: "5", output: "0", sample: 0 },
    ],
  },
];

// Upsert: insert new problems, and update starter code / description / points on existing
// ones too (so re-running this script always syncs to the latest definitions above).
const upsertProblem = db.prepare(`
  INSERT INTO problems (slug, title, difficulty, description, points, starter_js, starter_py)
  VALUES (@slug, @title, @difficulty, @description, @points, @starter_js, @starter_py)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    difficulty = excluded.difficulty,
    description = excluded.description,
    points = excluded.points,
    starter_js = excluded.starter_js,
    starter_py = excluded.starter_py
`);

const insertTest = db.prepare(`
  INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
  VALUES (?, ?, ?, ?)
`);

const getBySlug = db.prepare(`SELECT id FROM problems WHERE slug = ?`);
const countTests = db.prepare(`SELECT COUNT(*) as c FROM test_cases WHERE problem_id = ?`);

const tx = db.transaction(() => {
  for (const p of problems) {
    upsertProblem.run(p);
    const row = getBySlug.get(p.slug);
    const existing = countTests.get(row.id).c;
    if (existing === 0) {
      for (const t of p.tests) {
        insertTest.run(row.id, t.input, t.output, t.sample);
      }
    }
  }
});

tx();

console.log(`Seeded/updated ${problems.length} problems.`);
