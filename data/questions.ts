const questions = [
	{
		id: 1,
		title: "Count digits in a number",
		description: "Write a program to count digits in a number.",
		input: "num = 12345",
		output: "5",

		completed: false,
	},
	{
		id: 2,
		title: "Sum of digits in a number",
		description: "Write a program to sum of digits in a number.",
		input: "num = 12345",
		output: "15",

		completed: false,
	},
	{
		id: 3,
		title: "Find the largest among three numbers",
		description: "Write a program to find the largest among three numbers.",
		input: "a = 10, b = 25, c = 15",
		output: "25",

		completed: false,
	},
	{
		id: 4,
		title: "Find the smallest among three numbers",
		description: "Write a program to find the smallest among three numbers.",
		input: "a = 10, b = 25, c = 15",
		output: "10",

		completed: false,
	},
	{
		id: 5,
		title: "Check if a number is prime",
		description: "Write a program to check if a number is prime.",
		input: "num = 17",
		output: "true",

		completed: false,
	},
	{
		id: 6,
		title: "Print all prime numbers till n",
		description: "Write a program to print all prime numbers till n.",
		input: "n = 10",
		output: "[2, 3, 5, 7]",

		completed: false,
	},
	{
		id: 7,
		title: "Find GCD (HCF) of two numbers",
		description: "Write a program to find gcd (hcf) of two numbers.",
		input: "a = 20, b = 28",
		output: "4",

		completed: false,
	},
	{
		id: 8,
		title: "Find LCM of two numbers",
		description: "Write a program to find lcm of two numbers.",
		input: "a = 12, b = 18",
		output: "36",

		completed: false,
	},
	{
		id: 9,
		title: "Print all factors of a number",
		description: "Write a program to print all factors of a number.",
		input: "num = 12",
		output: "[1, 2, 3, 4, 6, 12]",

		completed: false,
	},
	{
		id: 10,
		title: "Check if a number is Armstrong (e.g., 153)",
		description: "Write a program to check if a number is armstrong (e.g., 153).",
		input: "num = 153",
		output: "true",

		completed: false,
	},
	{
		id: 11,
		title: "Check if a year is leap year",
		description: "Write a program to check if a year is leap year.",
		input: "year = 2024",
		output: "true",

		completed: false,
	},
	{
		id: 12,
		title: "Convert Celsius to Fahrenheit",
		description: "Write a program to convert celsius to fahrenheit.",
		input: "celsius = 0",
		output: "32.0",

		completed: false,
	},
	{
		id: 13,
		title: "Convert Fahrenheit to Celsius",
		description: "Write a program to convert fahrenheit to celsius.",
		input: "fahrenheit = 32",
		output: "0.0",

		completed: false,
	},
	{
		id: 14,
		title: "Find power of a number (a^b) using loops",
		description: "Write a program to find power of a number (a^b) using loops.",
		input: "a = 2, b = 5",
		output: "32",

		completed: false,
	},
	{
		id: 15,
		title: "Find sum of first n natural numbers",
		description: "Write a program to find sum of first n natural numbers.",
		input: "n = 5",
		output: "15",

		completed: false,
	},
	{
		id: 16,
		title: "Find sum of squares of first n natural numbers",
		description: "Write a program to find sum of squares of first n natural numbers.",
		input: "n = 3",
		output: "14",

		completed: false,
	},
	{
		id: 17,
		title: "Find sum of cubes of first n natural numbers",
		description: "Write a program to find sum of cubes of first n natural numbers.",
		input: "n = 3",
		output: "36",

		completed: false,
	},
	{
		id: 18,
		title: "Calculate average of n numbers",
		description: "Write a program to calculate average of n numbers.",
		input: "nums = [2, 4, 6, 8]",
		output: "5.0",

		completed: false,
	},
	{
		id: 19,
		title: "Print all alphabets from A to Z",
		description: "Write a program to print all alphabets from a to z.",
		input: "none",
		output: "A B C D E ... Z",

		completed: false,
	},
	{
		id: 20,
		title: "Print ASCII value of a character",
		description: "Write a program to print ascii value of a character.",
		input: "char = 'A'",
		output: "65",

		completed: false,
	},
	{
		id: 21,
		title: "Check if a character is vowel or consonant",
		description: "Write a program to check if a character is vowel or consonant.",
		input: "char = 'a'",
		output: "vowel",

		completed: false,
	},
	{
		id: 22,
		title: "Count number of vowels and consonants in a string",
		description: "Write a program to count number of vowels and consonants in a string.",
		input: 'str = "Hello World"',
		output: "vowels: 3, consonants: 7",

		completed: false,
	},
	{
		id: 23,
		title: "Count number of words in a string",
		description: "Write a program to count number of words in a string.",
		input: 'str = "Hello World Example"',
		output: "3",

		completed: false,
	},
	{
		id: 24,
		title: "Reverse a string (without using library)",
		description: "Write a program to reverse a string (without using library).",
		input: 'str = "Hello"',
		output: '"olleH"',

		completed: false,
	},
	{
		id: 25,
		title: "Check if a string is palindrome",
		description: "Write a program to check if a string is palindrome.",
		input: 'str = "racecar"',
		output: "true",

		completed: false,
	},
	{
		id: 26,
		title: "Find frequency of a character in a string",
		description: "Write a program to find frequency of a character in a string.",
		input: "str = \"hello\", char = 'l'",
		output: "2",

		completed: false,
	},
	{
		id: 27,
		title: "Find frequency of each character in a string",
		description: "Write a program to find frequency of each character in a string.",
		input: 'str = "hello"',
		output: '{"h": 1, "e": 1, "l": 2, "o": 1}',

		completed: false,
	},
	{
		id: 28,
		title: "Remove vowels from a string",
		description: "Write a program to remove vowels from a string.",
		input: 'str = "hello world"',
		output: '"hll wrld"',

		completed: false,
	},
	{
		id: 29,
		title: "Remove spaces from a string",
		description: "Write a program to remove spaces from a string.",
		input: 'str = "hello world example"',
		output: '"helloworldexample"',

		completed: false,
	},
	{
		id: 30,
		title: "Find the largest element in an array",
		description: "Write a program to find the largest element in an array.",
		input: "nums = [3, 7, 2, 9, 1]",
		output: "9",

		completed: false,
	},
	{
		id: 31,
		title: "Find the smallest element in an array",
		description: "Write a program to find the smallest element in an array.",
		input: "nums = [3, 7, 2, 9, 1]",
		output: "1",

		completed: false,
	},
	{
		id: 32,
		title: "Find the sum of elements of an array",
		description: "Write a program to find the sum of elements of an array.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "15",

		completed: false,
	},
	{
		id: 33,
		title: "Find the average of elements of an array",
		description: "Write a program to find the average of elements of an array.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "3.0",

		completed: false,
	},
	{
		id: 34,
		title: "Search an element in an array",
		description: "Write a program to search an element in an array.",
		input: "nums = [10, 20, 30, 40, 50], target = 30",
		output: "Found at index 2",

		completed: false,
	},
	{
		id: 35,
		title: "Count even and odd numbers in an array",
		description: "Write a program to count even and odd numbers in an array.",
		input: "nums = [1, 2, 3, 4, 5, 6]",
		output: "even: 3, odd: 3",

		completed: false,
	},
	{
		id: 36,
		title: "Copy all elements from one array to another",
		description: "Write a program to copy all elements from one array to another.",
		input: "array1 = [1, 2, 3, 4, 5]",
		output: "array2 = [1, 2, 3, 4, 5]",

		completed: false,
	},
	{
		id: 37,
		title: "Merge two arrays into a third array",
		description: "Write a program to merge two arrays into a third array.",
		input: "array1 = [1, 2, 3], array2 = [4, 5, 6]",
		output: "array3 = [1, 2, 3, 4, 5, 6]",

		completed: false,
	},
	{
		id: 38,
		title: "Find the second largest element in an array",
		description: "Write a program to find the second largest element in an array.",
		input: "nums = [10, 5, 20, 8, 15]",
		output: "15",

		completed: false,
	},
	{
		id: 39,
		title: "Find the second smallest element in an array",
		description: "Write a program to find the second smallest element in an array.",
		input: "nums = [10, 5, 20, 8, 15]",
		output: "8",

		completed: false,
	},
	{
		id: 40,
		title: "Sort an array in ascending order (basic)",
		description: "Write a program to sort an array in ascending order (basic).",
		input: "nums = [5, 2, 8, 1, 9]",
		output: "[1, 2, 5, 8, 9]",

		completed: false,
	},
	{
		id: 41,
		title: "Sort an array in descending order (basic)",
		description: "Write a program to sort an array in descending order (basic).",
		input: "nums = [5, 2, 8, 1, 9]",
		output: "[9, 8, 5, 2, 1]",

		completed: false,
	},
	{
		id: 42,
		title: "Find the difference between largest and smallest element",
		description: "Write a program to find the difference between largest and smallest element.",
		input: "nums = [10, 5, 20, 8, 15]",
		output: "15",

		completed: false,
	},
	{
		id: 43,
		title: "Check if array is sorted in ascending order",
		description: "Write a program to check if array is sorted in ascending order.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "true",

		completed: false,
	},
	{
		id: 44,
		title: "Check if array contains duplicate elements",
		description: "Write a program to check if array contains duplicate elements.",
		input: "nums = [1, 2, 3, 2, 5]",
		output: "true",

		completed: false,
	},
	{
		id: 45,
		title: "Remove duplicates from an array (without extra space)",
		description: "Write a program to remove duplicates from an array (without extra space).",
		input: "nums = [1, 2, 2, 3, 4, 4, 5]",
		output: "[1, 2, 3, 4, 5]",

		completed: false,
	},
	{
		id: 46,
		title: "Rotate an array by one position to right",
		description: "Write a program to rotate an array by one position to right.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[5, 1, 2, 3, 4]",

		completed: false,
	},
	{
		id: 47,
		title: "Rotate an array by k positions to right",
		description: "Write a program to rotate an array by k positions to right.",
		input: "nums = [1, 2, 3, 4, 5], k = 2",
		output: "[4, 5, 1, 2, 3]",

		completed: false,
	},
	{
		id: 48,
		title: "Rotate an array by one position to left",
		description: "Write a program to rotate an array by one position to left.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[2, 3, 4, 5, 1]",

		completed: false,
	},
	{
		id: 49,
		title: "Rotate an array by k positions to left",
		description: "Write a program to rotate an array by k positions to left.",
		input: "nums = [1, 2, 3, 4, 5], k = 2",
		output: "[3, 4, 5, 1, 2]",

		completed: false,
	},
	{
		id: 50,
		title: "Find the sum of even elements in an array",
		description: "Write a program to find the sum of even elements in an array.",
		input: "nums = [1, 2, 3, 4, 5, 6]",
		output: "12",

		completed: false,
	},
	{
		id: 51,
		title: "Find the sum of odd elements in an array",
		description: "Write a program to find the sum of odd elements in an array.",
		input: "nums = [1, 2, 3, 4, 5, 6]",
		output: "9",

		completed: false,
	},
	{
		id: 52,
		title: "Replace every negative number in array with 0",
		description: "Write a program to replace every negative number in array with 0.",
		input: "nums = [1, -2, 3, -4, 5]",
		output: "[1, 0, 3, 0, 5]",

		completed: false,
	},
	{
		id: 53,
		title: "Replace every even number with double its value",
		description: "Write a program to replace every even number with double its value.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[1, 4, 3, 8, 5]",

		completed: false,
	},
	{
		id: 54,
		title: "Replace every odd number with triple its value",
		description: "Write a program to replace every odd number with triple its value.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[3, 2, 9, 4, 15]",

		completed: false,
	},
	{
		id: 55,
		title: "Find the maximum product of two elements in an array",
		description: "Write a program to find the maximum product of two elements in an array.",
		input: "nums = [3, 5, 2, 8, 1]",
		output: "40",

		completed: false,
	},
	{
		id: 56,
		title: "Find the minimum product of two elements in an array",
		description: "Write a program to find the minimum product of two elements in an array.",
		input: "nums = [3, 5, 2, 8, 1]",
		output: "2",

		completed: false,
	},
	{
		id: 57,
		title: "Swap first and last element of an array",
		description: "Write a program to swap first and last element of an array.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[5, 2, 3, 4, 1]",

		completed: false,
	},
	{
		id: 58,
		title: "Swap two elements at given positions",
		description: "Write a program to swap two elements at given positions.",
		input: "nums = [1, 2, 3, 4, 5], pos1 = 1, pos2 = 3",
		output: "[1, 4, 3, 2, 5]",

		completed: false,
	},
	{
		id: 59,
		title: "Find common elements between two arrays",
		description: "Write a program to find common elements between two arrays.",
		input: "array1 = [1, 2, 3, 4], array2 = [3, 4, 5, 6]",
		output: "[3, 4]",

		completed: false,
	},
	{
		id: 60,
		title: "Find unique elements between two arrays",
		description: "Write a program to find unique elements between two arrays.",
		input: "array1 = [1, 2, 3, 4], array2 = [3, 4, 5, 6]",
		output: "[1, 2, 5, 6]",

		completed: false,
	},
	{
		id: 61,
		title: "Reverse an array without using library functions",
		description: "Write a program to reverse an array without using library functions.",
		input: "nums = [1, 2, 3, 4, 5]",
		output: "[5, 4, 3, 2, 1]",

		completed: false,
	},
	{
		id: 62,
		title: "Find the element with maximum frequency",
		description: "Write a program to find the element with maximum frequency.",
		input: "nums = [1, 2, 2, 3, 3, 3, 4]",
		output: "3",

		completed: false,
	},
	{
		id: 63,
		title: "Find the missing number from 1 to n",
		description: "Write a program to find the missing number from 1 to n.",
		input: "nums = [1, 2, 4, 5, 6], n = 6",
		output: "3",

		completed: false,
	},
	{
		id: 64,
		title: "Find all pairs with a given sum",
		description: "Write a program to find all pairs with a given sum.",
		input: "nums = [1, 5, 7, 2, 9, 3], sum = 10",
		output: "[(1, 9), (7, 3)]",

		completed: false,
	},
	{
		id: 65,
		title: "Find all triplets with a given sum",
		description: "Write a program to find all triplets with a given sum.",
		input: "nums = [1, 2, 3, 4, 5, 6, 7], sum = 12",
		output: "[(1, 4, 7), (1, 5, 6), (2, 3, 7), (2, 4, 6), (3, 4, 5)]",

		completed: false,
	},
	{
		id: 66,
		title: "Check if two arrays are equal or not",
		description: "Write a program to check if two arrays are equal or not.",
		input: "array1 = [1, 2, 3, 4], array2 = [1, 2, 3, 4]",
		output: "true",

		completed: false,
	},
	{
		id: 67,
		title: "Count positive and negative numbers in an array",
		description: "Write a program to count positive and negative numbers in an array.",
		input: "nums = [1, -2, 3, -4, 5, 0]",
		output: "positive: 3, negative: 2, zero: 1",

		completed: false,
	},
	{
		id: 68,
		title: "Find the longest sequence of consecutive numbers",
		description: "Write a program to find the longest sequence of consecutive numbers.",
		input: "nums = [100, 4, 200, 1, 3, 2, 5]",
		output: "[1, 2, 3, 4, 5]",

		completed: false,
	},
	{
		id: 69,
		title: "Find the first repeating element in an array",
		description: "Write a program to find the first repeating element in an array.",
		input: "nums = [1, 5, 3, 4, 3, 5, 6]",
		output: "5",

		completed: false,
	},
	{
		id: 70,
		title: "Find the first non-repeating element in an array",
		description: "Write a program to find the first non-repeating element in an array.",
		input: "nums = [9, 4, 9, 6, 7, 4]",
		output: "6",

		completed: false,
	},
	{
		id: 71,
		title: "Find the second occurrence of an element",
		description: "Write a program to find the second occurrence of an element.",
		input: "nums = [1, 5, 3, 5, 6, 7], target = 5",
		output: "Index: 3",

		completed: false,
	},
	{
		id: 72,
		title: "Move all zeroes to end of array",
		description: "Write a program to move all zeroes to end of array.",
		input: "nums = [0, 1, 0, 3, 12]",
		output: "[1, 3, 12, 0, 0]",

		completed: false,
	},
	{
		id: 73,
		title: "Move all even numbers to the beginning and odd to end",
		description: "Write a program to move all even numbers to the beginning and odd to end.",
		input: "nums = [1, 2, 3, 4, 5, 6, 7, 8]",
		output: "[2, 4, 6, 8, 1, 3, 5, 7]",

		completed: false,
	},
	{
		id: 74,
		title: "Replace each element with the next greatest element",
		description: "Write a program to replace each element with the next greatest element.",
		input: "nums = [17, 18, 5, 4, 6, 1]",
		output: "[18, 6, 6, 6, 1, -1]",

		completed: false,
	},
	{
		id: 75,
		title: "Find leaders in an array (element greater than all elements to its right)",
		description: "Write a program to find leaders in an array (element greater than all elements to its right).",
		input: "nums = [16, 17, 4, 3, 5, 2]",
		output: "[17, 5, 2]",

		completed: false,
	},
	{
		id: 76,
		title: "Count number of peaks in an array (element greater than neighbors)",
		description: "Write a program to count number of peaks in an array (element greater than neighbors).",
		input: "nums = [1, 3, 2, 6, 5, 7, 4]",
		output: "3",

		completed: false,
	},
	{
		id: 77,
		title: "Find if there is a subarray with sum 0",
		description: "Write a program to find if there is a subarray with sum 0.",
		input: "nums = [4, 2, -3, 1, 6]",
		output: "true",

		completed: false,
	},
	{
		id: 78,
		title: "Find the maximum sum subarray (basic version)",
		description: "Write a program to find the maximum sum subarray (basic version).",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 79,
		title: "Find the minimum sum subarray (basic version)",
		description: "Write a program to find the minimum sum subarray (basic version).",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 80,
		title: "Find equilibrium index of an array (sum of left = sum of right)",
		description: "Write a program to find equilibrium index of an array (sum of left = sum of right).",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 81,
		title: "Implement basic calculator (addition, subtraction, multiplication, division)",
		description: "Write a program to implement basic calculator (addition, subtraction, multiplication, division).",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 82,
		title: "Find all numbers which are perfect squares till n",
		description: "Write a program to find all numbers which are perfect squares till n.",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 83,
		title: "Find sum of all prime numbers till n",
		description: "Write a program to find sum of all prime numbers till n.",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 84,
		title: "Find numbers that are both prime and palindrome till n",
		description: "Write a program to find numbers that are both prime and palindrome till n.",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 85,
		title: "Find the nth Fibonacci number (without recursion)",
		description: "Write a program to find the nth fibonacci number (without recursion).",
		input: "example input",
		output: "example output",

		completed: false,
	},
	{
		id: 86,
		title: "Create a program to guess a random number (user guesses computer number)",
		description: "Write a program to create a program to guess a random number (user guesses computer number).",
		input: "example input",
		output: "example output",

		completed: false,
	},
];

export default questions;
