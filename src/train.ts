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

function palindromCheck(str: string): boolean {
    const reversed = str.split("").reverse().join("");
    return str === reversed;
}

console.log(palindromCheck("dad"));
console.log(palindromCheck("son"));


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