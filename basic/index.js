const rect = require('./retangle');

function solveRect(l, b) {
    console.log(`Solving for rectange with l = ${l} and b = ${b}`);

    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log(`ERROR: ${err.message}`);
        } else {
            console.log(`The area of the rectangle is ${rectangle.area(l, b)}`);
            console.log(`The perimeter of the rectangle is ${rectangle.perimeter(l, b)}`);
        }
    })

    console.log("This statement after the call to rect()");
}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5);
