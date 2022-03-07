import {directoryExists, getCurrentDirectoryBase} from "./files";

describe('Files', () => {

    it('should get current directory base', () => {
        expect(getCurrentDirectoryBase()).toBe('cli');
    });

    it('should check if directory exists', () => {
        let filePath = `${process.cwd()}`;
        expect(directoryExists(filePath)).toBeTruthy();
    });
});
