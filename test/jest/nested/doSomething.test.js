import {doSomething} from '../../../src/doSomething';

describe('do something', () => {
    it('does not throw', async () => {
        const result = await doSomething();

        expect(result).toBe('hello world');
    });
});