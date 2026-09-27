
// O TASK

function calculateSumOfNumbers(arr: any[]): number {
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "number") {
            sum += arr[i];
        }
    }

    return sum;
}

console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]));

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