function sum(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function subtract(a, b) {
    return a - b;
}

module.exports = {
    sum,
    multiply,
    subtract
};

if (require.main === module) {
    const a = Math.floor(Math.random()*100) + 1;
    const b = Math.floor(Math.random() *100) + 1;
    console.log("The sum of", a, "and", b, "is:", sum(a, b));
}