// # S Task

function missingNumber(numbers: number[]): number {
    for (let i = 0; i <= numbers.length; i++) {
        if (!numbers.includes(i)) {
            return i;
        }
    }

    return -1;
}

console.log(missingNumber([3, 0, 1]));

console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]));

// # R Task

// newFunction();



// function newFunction() {
//     function calculate(str: string): number {
//         const parts = str.split("+");

//         let sum = 0;

//         for (const part of parts) {
//             sum += Number(part);
//         }

//         return sum;
//     }

//     // Test:
//     console.log(calculate("1+3"));
//     console.log(calculate("5+10"));
//     console.log(calculate("2+2+2"));
// }
// Q Task
// function hasProperty(obj: any, key: string): boolean {
//     const keys = Object.keys(obj);
//     const result = keys.includes(key);
//     return result;
// }


// console.log(hasProperty({ name: "BMW", model: "M3" }, "model"));
// console.log(hasProperty({ name: "BMW", model: "M3" }, "year"));

// P Task

// function objectToArray(obj: any): any[] {
//     const result: any[] = [];
//     const keys = Object.keys(obj);

//     for (let i = 0; i < keys.length; i++) {
//         const key = keys[i];
//         const value = obj[key];
//         result.push([key, value]);
//     }

//     return result;
// }


// console.log(objectToArray({ a: 10, b: 20 }));



// O TASK

// function calculateSumOfNumbers(arr: any[]): number {
//     let sum = 0;

//     for (let i = 0; i < arr.length; i++) {
//         if (typeof arr[i] === "number") {
//             sum += arr[i];
//         }
//     }

//     return sum;
// }

// console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]));

/* Project Standards:
 - Logging standards
 - Naming standards:
     function, method, variable => CAMEL
     class => PASCAL
     folder => KEBAB
     css => SNAKE
 - Error handling
*/



// N TASK 

// function palindromCheck(str: string): boolean {
//     const reversed = str.split("").reverse().join("");
//     return str === reversed;
// }

// console.log(palindromCheck("dad"));
// console.log(palindromCheck("son"));


// M TASK

// function getSquareNumbers(numbers: number[]) {
//     let result = [];

//     for (let number of numbers) {
//         result.push({
//             number: number,
//             square: number * number
//         });
//     }

//     return result;
// }

// console.log(getSquareNumbers([1, 2, 3]));