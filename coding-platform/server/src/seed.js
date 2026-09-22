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
    starter_js: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\n');
const nums = lines[0].trim().split(/\s+/).map(Number);
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

data = sys.stdin.read().strip().split('\n')
nums = list(map(int, data[0].split()))
target = int(data[1])
print(' '.join(map(str, two_sum(nums, target))))
`,
    starter_c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char line[100000];
    fgets(line, sizeof(line), stdin);
    long nums[10000]; int n = 0;
    char *tok = strtok(line, " \t\n");
    while (tok) { nums[n++] = atol(tok); tok = strtok(NULL, " \t\n"); }
    long target; scanf("%ld", &target);

    // TODO: find i, j such that nums[i] + nums[j] == target
    int i = 0, j = 0;

    printf("%d %d\n", i, j);
    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line; getline(cin, line);
    istringstream iss(line);
    vector<long long> nums; long long x;
    while (iss >> x) nums.push_back(x);
    long long target; cin >> target;

    // TODO: find i, j such that nums[i] + nums[j] == target
    int i = 0, j = 0;

    cout << i << " " << j << "\n";
    return 0;
}
`,
    starter_java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        List<Long> nums = new ArrayList<>();
        while (st.hasMoreTokens()) nums.add(Long.parseLong(st.nextToken()));
        long target = Long.parseLong(br.readLine().trim());

        // TODO: find i, j such that nums[i] + nums[j] == target
        int i = 0, j = 0;

        System.out.println(i + " " + j);
    }
}
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
    starter_js: `const s = require('fs').readFileSync(0, 'utf8').replace(/\n$/, '');

function reverseString(str) {
  // TODO: return the reversed string

}

console.log(reverseString(s));
`,
    starter_py: `import sys

def reverse_string(s):
    # TODO: return the reversed string
    pass

s = sys.stdin.readline().rstrip('\n')
print(reverse_string(s))
`,
    starter_c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[100000];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    s[strcspn(s, "\n")] = 0;

    // TODO: print the reverse of s

    printf("%s\n", s);
    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s; getline(cin, s);

    // TODO: print the reverse of s

    cout << s << "\n";
    return 0;
}
`,
    starter_java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();

        // TODO: print the reverse of s

        System.out.println(s);
    }
}
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

console.log(fizzBuzz(n).join('\n'));
`,
    starter_py: `import sys

def fizz_buzz(n):
    # TODO: return a list of strings, one per line, per the rules above
    pass

n = int(sys.stdin.readline().strip())
print('\n'.join(fizz_buzz(n)))
`,
    starter_c: `#include <stdio.h>

int main() {
    int n; scanf("%d", &n);

    // TODO: for i=1..n print Fizz/Buzz/FizzBuzz/i per rules, one per line
    for (int i = 1; i <= n; i++) printf("%d\n", i);

    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;

    // TODO: for i=1..n print Fizz/Buzz/FizzBuzz/i per rules, one per line
    for (int i = 1; i <= n; i++) cout << i << "\n";

    return 0;
}
`,
    starter_java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // TODO: for i=1..n print Fizz/Buzz/FizzBuzz/i per rules, one per line
        for (int i = 1; i <= n; i++) System.out.println(i);
    }
}
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
    starter_js: `const s = require('fs').readFileSync(0, 'utf8').replace(/\n$/, '');

function isPalindrome(str) {
  // TODO: return true or false

}

console.log(isPalindrome(s) ? 'true' : 'false');
`,
    starter_py: `import sys

def is_palindrome(s):
    # TODO: return True or False
    pass

s = sys.stdin.readline().rstrip('\n')
print('true' if is_palindrome(s) else 'false')
`,
    starter_c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main() {
    char s[100000];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    s[strcspn(s, "\n")] = 0;

    // TODO: check alnum-only, case-insensitive palindrome; print "true" or "false"

    printf("false\n");
    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s; getline(cin, s);

    // TODO: check alnum-only, case-insensitive palindrome; print "true" or "false"

    cout << "false" << "\n";
    return 0;
}
`,
    starter_java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();

        // TODO: check alnum-only, case-insensitive palindrome; print "true" or "false"

        System.out.println("false");
    }
}
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
    starter_js: `const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

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
    starter_c: `#include <stdio.h>

int main() {
    long nums[100000]; int n = 0; long x;
    while (scanf("%ld", &x) == 1) nums[n++] = x;

    // TODO: Kadane's algorithm - print max subarray sum

    printf("0\n");
    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<long long> nums; long long x;
    while (cin >> x) nums.push_back(x);

    // TODO: Kadane's algorithm - print max subarray sum

    cout << 0 << "\n";
    return 0;
}
`,
    starter_java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Long> nums = new ArrayList<>();
        while (sc.hasNextLong()) nums.add(sc.nextLong());

        // TODO: Kadane's algorithm - print max subarray sum

        System.out.println(0);
    }
}
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
    starter_js: `const lines = require('fs').readFileSync(0, 'utf8').trim().split('\n');
const nums = lines[0].trim().split(/\s+/).map(Number);
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

data = sys.stdin.read().strip().split('\n')
nums = list(map(int, data[0].split()))
target = int(data[1])
print(binary_search(nums, target))
`,
    starter_c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char line[100000];
    fgets(line, sizeof(line), stdin);
    long nums[100000]; int n = 0;
    char *tok = strtok(line, " \t\n");
    while (tok) { nums[n++] = atol(tok); tok = strtok(NULL, " \t\n"); }
    long target; scanf("%ld", &target);

    // TODO: O(log n) binary search - print index of target, or -1

    printf("-1\n");
    return 0;
}
`,
    starter_cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line; getline(cin, line);
    istringstream iss(line);
    vector<long long> nums; long long x;
    while (iss >> x) nums.push_back(x);
    long long target; cin >> target;

    // TODO: O(log n) binary search - print index of target, or -1

    cout << -1 << "\n";
    return 0;
}
`,
    starter_java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        List<Long> nums = new ArrayList<>();
        while (st.hasMoreTokens()) nums.add(Long.parseLong(st.nextToken()));
        long target = Long.parseLong(br.readLine().trim());

        // TODO: O(log n) binary search - print index of target, or -1

        System.out.println(-1);
    }
}
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
  INSERT INTO problems (slug, title, difficulty, description, points, starter_js, starter_py, starter_c, starter_cpp, starter_java)
  VALUES (@slug, @title, @difficulty, @description, @points, @starter_js, @starter_py, @starter_c, @starter_cpp, @starter_java)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    difficulty = excluded.difficulty,
    description = excluded.description,
    points = excluded.points,
    starter_js = excluded.starter_js,
    starter_py = excluded.starter_py,
    starter_c = excluded.starter_c,
    starter_cpp = excluded.starter_cpp,
    starter_java = excluded.starter_java
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

console.log(`Seeded/updated ${problems.length} problems (with C/C++/Java starters).`);

// --- Demo contest: live for ~2 hours from whenever this seed script runs, so
// you always have something to test contest mode against right after seeding. ---
const contestSlug = "weekly-challenge-1";
const contestProblemSlugs = ["two-sum", "reverse-string", "fizzbuzz", "valid-palindrome"];

const upsertContest = db.prepare(`
  INSERT INTO contests (slug, title, description, start_time, end_time)
  VALUES (@slug, @title, @description, @start_time, @end_time)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    start_time = excluded.start_time,
    end_time = excluded.end_time
`);

const window = db
  .prepare(`SELECT datetime('now', '-10 minutes') as start_time, datetime('now', '+2 hours') as end_time`)
  .get();

upsertContest.run({
  slug: contestSlug,
  title: "Weekly Challenge #1",
  description: "A short timed contest covering easy warm-up problems.",
  start_time: window.start_time,
  end_time: window.end_time,
});

const contestRow = db.prepare("SELECT id FROM contests WHERE slug = ?").get(contestSlug);
const upsertContestProblem = db.prepare(`
  INSERT INTO contest_problems (contest_id, problem_id, points)
  VALUES (?, ?, ?)
  ON CONFLICT(contest_id, problem_id) DO UPDATE SET points = excluded.points
`);
contestProblemSlugs.forEach((slug, idx) => {
  const p = getBySlug.get(slug);
  if (p) upsertContestProblem.run(contestRow.id, p.id, (idx + 1) * 10);
});

console.log(`Seeded demo contest "${contestSlug}" (live now for ~2 hours).`);
