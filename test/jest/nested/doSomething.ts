import { fakeReject, fakeResolve } from './fake';

export const doSomething = async () => {
    try {
        const result = await fakeResolve();

        try {
            await fakeReject();
        } catch (err) {
            console.log(`Oh no: ${err}`);
        }

        return result;
    } catch (err) {
        console.log('Should not get here');
    }
};