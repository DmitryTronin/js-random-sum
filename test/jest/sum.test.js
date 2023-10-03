const { sum, multiply, subtract } = require('./sum.js');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('multiplies 1 and 2 to equal 2', () => {
    expect(multiply(1, 2)).toBe(2);
});

test('subtracts 1 and 2 to equal -1', () => {
    expect(subtract(1, 2)).toBe(-1);
});
