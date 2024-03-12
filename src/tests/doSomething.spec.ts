import { doSomething } from '../doSomething';
import { fakeReject, fakeResolve } from '../fake';

jest.mock('../fake');

describe("doSomething", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns the result and handles the rejection', async () => {
        const result = 'result';
        (fakeResolve as jest.Mock).mockResolvedValue(result);
        (fakeReject as jest.Mock).mockRejectedValue('Fake Error');

        const consoleSpy = jest.spyOn(console, 'log');

        const output = await doSomething();

        expect(fakeResolve).toHaveBeenCalledTimes(1);
        expect(fakeReject).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('Oh no: Fake Error');
        expect(output).toEqual(result);
    });

    it('handles the outer catch block', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        (fakeResolve as jest.Mock).mockRejectedValue('Fake Error');

        await doSomething();

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('Should not get here');
    });
});