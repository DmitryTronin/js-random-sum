describe('matches on acceptable string formats', () => {
    const tests = [
        {args: 'f567', want: 'f567'},
        {args: 'F12 + 2 / f45', want: 'F12'},
        // More test cases...
    ];

    tests.forEach(({args, want}) => {
        it(`correctly matches '${args}' to give '${want}'`, () => {
            expect(args).toMatch(/[f]\d+/ig);
        });
    });
});