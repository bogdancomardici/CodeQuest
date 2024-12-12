-- Create sequences first
DROP SEQUENCE IF EXISTS badge_id_seq CASCADE;
CREATE SEQUENCE badge_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

DROP SEQUENCE IF EXISTS challenge_id_seq CASCADE;
CREATE SEQUENCE challenge_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

DROP SEQUENCE IF EXISTS resource_id_seq CASCADE;
CREATE SEQUENCE resource_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

DROP TABLE IF EXISTS "friends" CASCADE;
DROP TABLE IF EXISTS "userbadge" CASCADE;
DROP TABLE IF EXISTS "userchallenge" CASCADE;

DROP TABLE IF EXISTS "badges" CASCADE;
DROP TABLE IF EXISTS "challenges" CASCADE;
DROP TABLE IF EXISTS "resources" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;


CREATE TABLE "public"."badges" (
    "id" integer DEFAULT nextval('badge_id_seq') NOT NULL,
    "title" character varying(50) NOT NULL,
    "description" character varying(200) NOT NULL,
    CONSTRAINT "badge_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "badge_title_key" UNIQUE ("title")
) WITH (oids = false);


DROP TABLE IF EXISTS "challenges";



CREATE TABLE "public"."challenges" (
    "id" integer DEFAULT nextval('challenge_id_seq') NOT NULL,
    "title" character varying(50) NOT NULL,
    "description" character varying(2000) NOT NULL,
    "input" character varying(300) NOT NULL,
    "output" character varying(300) NOT NULL,
    "difficulty" character varying(20) NOT NULL,
    "language" character varying(20) NOT NULL,
    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "challenge_title_key" UNIQUE ("title")
) WITH (oids = false);


DROP TABLE IF EXISTS "friends";
CREATE TABLE "public"."friends" (
    "user_id1" integer NOT NULL,
    "user_id2" integer NOT NULL,
    CONSTRAINT "friend_pkey" PRIMARY KEY ("user_id1", "user_id2")
) WITH (oids = false);


DROP TABLE IF EXISTS "resources";


CREATE TABLE "public"."resources" (
    "id" integer DEFAULT nextval('resource_id_seq') NOT NULL,
    "title" character varying(50) NOT NULL,
    "description" character varying(2000) NOT NULL,
    CONSTRAINT "resource_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resource_title_key" UNIQUE ("title")
) WITH (oids = false);


DROP TABLE IF EXISTS "userbadge";
CREATE TABLE "public"."userbadge" (
    "user_id" integer NOT NULL,
    "badge_id" integer NOT NULL,
    CONSTRAINT "friends_pkey" PRIMARY KEY ("user_id", "badge_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "userchallenge";
CREATE TABLE "public"."userchallenge" (
    "user_id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    CONSTRAINT "userchallenge_pkey" PRIMARY KEY ("user_id", "challenge_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";


CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "username" character varying(50) NOT NULL,
    "email" character varying(100) NOT NULL,
    "password" character varying(255) NOT NULL,
    "role" character varying(20) NOT NULL,
    "score" integer DEFAULT '0',
    CONSTRAINT "users_email_key" UNIQUE ("email"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_username_key" UNIQUE ("username")
) WITH (oids = false);


ALTER TABLE ONLY "public"."friends" ADD CONSTRAINT "friend_user_id1_fkey" FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."friends" ADD CONSTRAINT "friend_user_id2_fkey" FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."userbadge" ADD CONSTRAINT "friends_badge_id_fkey" FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."userbadge" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."userchallenge" ADD CONSTRAINT "userchallenge_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."userchallenge" ADD CONSTRAINT "userchallenge_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE NOT DEFERRABLE;
INSERT INTO badges (title, description) VALUES 
('Beginner Badge', 'Awarded for starting out'),
('Intermediate Badge', 'Awarded for progressing well'),
('Expert Badge', 'Awarded for mastery');
INSERT INTO challenges (title, description, input, output, difficulty, language) VALUES
('Palindrome', 'Given an integer x, return true if x is a palindrome, and false otherwise.
Example 1:

Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
Example 2:

Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
Example 3:

Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

Constraints:

-231 <= x <= 231 - 1

Follow up: Could you solve it without converting the integer to a string?', '121','True', 'Easy', 'Python'),
('Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest substring without repeating characters.


Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:

0 <= s.length <= 5 * 104
s consists of English letters, digits, symbols and spaces.', 'abcabcbb','3', 'Medium', 'JavaScript'),
('Longest valid parantheses', 'Given a string containing just the characters ( and ), return the length of the longest valid (well-formed) parentheses substring.

Example 1:

Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".
Example 2:

Input: s = ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()".
Example 3:

Input: s = ""
Output: 0


Constraints:

0 <= s.length <= 3 * 104
s[i] is ( or )', '(()','2', 'Hard', 'Go');
INSERT INTO resources (title, description) VALUES
('Understanding Palindromes', 'A palindrome is a sequence that reads the same backward as forward, such as "121" or "racecar". Negative numbers, like -121, are not palindromes as the negative sign breaks symmetry. Common solving techniques include reversing the sequence and comparing it to the original, or using mathematical operations (e.g., dividing and modulo operations) to reconstruct the reversed sequence without converting it to a string. This resource also covers handling edge cases and optimizing for large inputs.'),
('Optimizing String Manipulations', 'String manipulation problems often require finding patterns or relationships within the string, such as finding the longest substring without repeating characters. Techniques like the sliding window approach can help maintain a dynamic view of the substring, while hash maps can track character occurrences efficiently. This resource explains these techniques with examples and provides tips for handling edge cases, such as empty strings or strings with all unique characters.'),
('Mastering Parentheses Problems', 'Problems involving parentheses, like finding the longest valid substring, require understanding the concept of balanced parentheses. Techniques for solving such problems include using a stack to track unmatched opening brackets and dynamic programming to compute valid substrings based on prior results. For example, a stack can help identify the boundaries of valid substrings, while DP can keep track of the length of valid substrings ending at each position. This resource also addresses corner cases, such as strings with no valid parentheses.'),
('Algorithm Complexity Basics', 'Algorithm complexity helps evaluate the efficiency of a solution. This resource introduces Big-O notation for analyzing time and space complexity, providing real-world examples like iterating through arrays (O(n)) and nested loops (O(n^2)). Techniques for improving complexity include pruning unnecessary operations, using efficient data structures like hash maps for quick lookups (O(1)), and converting recursive solutions to iterative ones to save space.'),
('Python for Problem Solving', 'Python is a powerful language for solving algorithmic challenges due to its rich set of libraries and concise syntax. This resource covers common tools such as the `collections` module for counters and deques, `itertools` for generating combinations, and list comprehensions for creating efficient one-liners. Example problems, like checking for palindromes or finding the longest substring, are solved step-by-step, with tips on using Python’s built-in functions to minimize boilerplate code.'),
('JavaScript Algorithms', 'JavaScript is commonly used for solving algorithmic challenges in web development and competitive programming. This resource explains how to solve problems like finding the longest substring without repeating characters using ES6 features, such as `Set` for tracking unique characters or `Map` for storing indices. It also covers iterative and recursive techniques for problems, with a focus on performance optimization, such as avoiding redundant loops and leveraging array and string methods.'),
('Go Language Fundamentals', 'Go (or Golang) is a statically typed language known for its simplicity and efficiency in handling concurrency. This resource introduces Go’s syntax and features, such as goroutines for concurrent execution and channels for communication between goroutines. Examples demonstrate how to solve algorithmic problems in Go, like finding the longest valid parentheses substring, using its built-in functions and idiomatic patterns. Tips for error handling and testing are also provided.');
INSERT INTO users (username, email, password, role, score) VALUES
('user1', 'user1@example.com', '$2y$10$SRGvDkhxmYo/jtIccmmHK.LAeULCdfhnTgu63i0z/a8cCj3/sBZsG', 'admin', 100),
('user2', 'user2@example.com', 'hashed_password2', 'user', 50),
('user3', 'user3@example.com', 'hashed_password3', 'user', 75);