describe('Testing sum, multiply and subtract functions', () => {

    const { sum, multiply, subtract } = require('./sum.js');

    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });


    /**
     * Here we are testing the functions of the sum.js file. 
     * The functions include "sum", "multiply" and "subtract".
     * Each one is tested with a simple use case. 
     * 
     * For a detailed understanding, we encourage you to refer the 
     * documentation at : {@link https://example.com/yourDocLinkHere}
     */
    test('multiplies 1 and 2 to equal 2', () => {
        expect(multiply(1, 2)).toBe(2);
    });

    test('subtracts 1 and 2 to equal -1', () => {
        expect(subtract(1, 2)).toBe(-1);
    });


    test('this test will always fail', () => {
        expect(true).toBe(false);
    });

//    test.skip('this test will be ignored', () => {
//        expect(true).toBe(true);
//    });

});