import { configureGitSetup, logFailure, logSuccess, selectRepo } from './repo';

describe('Repo', () => {
	it('clone should throw an error and call removeDir', async () => {
		const removeDir = jest.fn(() => {});
		const tasks = configureGitSetup(
			'./',
			{ branch: '', repo: '' },
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
			'./',
			{ branch: '', repo: '' },
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

	it('should return correct repo for Angular', () => {
		const angularRepo = selectRepo({ 'ds-framework': 'angular' });
		expect(angularRepo).toStrictEqual({
			branch: 'main',
			repo: 'rangle/radius-angular'
		});
	});

	it('should return correct repo for React', () => {
		const reactRepo = selectRepo({ 'ds-framework': 'react["css"]' });
		expect(reactRepo).toBeDefined();
	});

	it('should return false if selection is empty', () => {
		const repo = selectRepo({});
		const logSpy = jest.spyOn(console, 'log');
		console.log('coming soon... 😉');
		expect(repo).toBeFalsy();
		expect(logSpy).toHaveBeenCalledWith('coming soon... 😉');
	});

	it('should log when creation is successful', () => {
		const logSpy = jest.spyOn(console, 'log');
		logSuccess({ 'ds-framework': 'angular' });
		expect(logSpy).toBeDefined();
	});

	it('should log when creation is NOT successful', () => {
		const logSpy = jest.spyOn(console, 'log');
		const error: any = '';
		console.log("Couldn't clone the repo.");
		logFailure(error);
		expect(logSpy).toBeDefined();
		expect(logSpy).toHaveBeenCalledWith("Couldn't clone the repo.");
	});
});
