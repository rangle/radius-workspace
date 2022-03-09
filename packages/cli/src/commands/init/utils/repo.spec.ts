import {configureGitSetup} from "./repo";

describe('Repo', () => {

    it('clone should throw an error and call removeDir', async () => {
        const removeDir = jest.fn(() => {});
        const tasks = configureGitSetup(
            "./",
            { branch: "", repo: "" },
            () => Promise.reject(),
            () => Promise.reject(new Error()),
            removeDir
        );

        try {
            await tasks.run();
        } catch (err) {
            expect(removeDir.mock.calls.length).toBe(1);
        }
    });

    it('checkout should throw an error and call removeDir', async () => {
        const removeDir = jest.fn(() => {});
        const tasks = configureGitSetup(
            "./",
            { branch: "", repo: "" },
            () => Promise.resolve(),
            () => Promise.reject(new Error()),
            removeDir
        );

        try {
            await tasks.run();
        } catch (err) {
            expect(removeDir.mock.calls.length).toBe(1);
        }
    });
});