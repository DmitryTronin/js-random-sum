it('matches on acceptable string formats', () => {
    const regex = /[f]\d+/ig;
    expect('f567').toMatch(regex);
    expect('F12 + 2 / f45').toMatch(regex);
    expect('Ff567').toMatch(regex);
    expect('f1 2').toMatch(regex);
    expect('F12abc + 123 + gf123').toMatch(regex);
});