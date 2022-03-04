import {filter, isReact, validateDesignSystemNameAnswer} from './inquirer';

describe('Inquirer', () => {

    it('should accept a design system name', () => {
        let designSystemName = 'This is an awesome test';
        expect(validateDesignSystemNameAnswer(designSystemName)).toBe(true);
    });

    it('should prompt the question again if design system name is empty or only white space', () => {
        let designSystemNameEmpty = '';
        let designSystemNameEmptySpace = ' '
        expect(validateDesignSystemNameAnswer(designSystemNameEmpty)).toBe('Please enter the name of the design system');
        expect(validateDesignSystemNameAnswer(designSystemNameEmptySpace)).toBe('Please enter the name of the design system');
    });

    it('should make everything lower case', () => {
        let val = "I AM ALL CAPS, MAKE ME LOWER CASE";
        expect(filter(val)).toBe("i am all caps, make me lower case");
    });

    it('should check if the answer is react', () => {
        expect(false).toBe(isReact('react'));
    });
});
