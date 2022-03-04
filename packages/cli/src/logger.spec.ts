import {init} from "./commands/init/command";
import { logger } from './logger';

describe('Logger', () => {
    it('should create', () => {
        expect(init).toBeTruthy();
    });

    it('logger returns "💿 Welcome to Radius! Let\'s get you set up with a new project."', () => {
        const loggerInfoSpy = jest.spyOn(logger, 'info');
        expect(logger.info).not.toBeCalled();
        logger.info("💿 Welcome to Radius! Let's get you set up with a new project.");
        expect(loggerInfoSpy).toHaveBeenCalledWith("💿 Welcome to Radius! Let's get you set up with a new project.");
    });
});

