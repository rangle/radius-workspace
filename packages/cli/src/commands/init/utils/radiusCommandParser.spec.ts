import { isInDependencies, getQuestions, defaultSetup } from './radiusCommandParser';
import { ConfigOptions } from './radiusCommandParser';
import inquirer from 'inquirer';

jest.mock('inquirer');
const mockedInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('is in dependencies tests', () => {
  it('The dependencies match the answers and will return true', () => {
    const dependencies = ['a', 'b', 'c'];
    const answers = ['a', 'b', 'c'];
    expect(isInDependencies(dependencies,answers)).toBeTruthy();
  });

  it('The dependencies do not match the answers and will return false', () => {
    const dependencies = ['a', 'b', 'd'];
    const answers = ['a', 'b', 'c'];
    expect(isInDependencies(dependencies,answers)).toBeFalsy();
  });

  it('The dependencies match the answers and have extra options, will return true', () => {
    const dependencies = ['a', 'b', 'd'];
    const answers = ['a', 'b', 'c','d','e','f'];
    expect(isInDependencies(dependencies,answers)).toBeTruthy();
  });
});


const catOptions: ConfigOptions = [
  // first questions
  {
    type: 'house',
    question: 'how big of a house do you need?',
    dependencies: [],
    id: 'two bedroom',
    name: 'two bedroom',    
    resolve: ['pets']
  },
  {
    type: 'house',
    question: 'how big of a house do you need?',
    dependencies: [],
    id: 'one bedroom', // one bedroom needs no cats
    name: 'one bedroom', // one bedroom needs no cats    
    resolve: ['pets']
  },

  // cat types
  {
    type: 'pets',
    question: 'What kind of cat',
    dependencies: ['two bedroom'],
    id: 'yellow',
    name: 'yellow',    
    resolve: ['foodtype']
  },
  {
    type: 'pets',
    question: 'What kind of cat',
    dependencies: ['two bedroom'],
    id: 'brown',
    name: 'brown',    
    resolve: ['foodtype']
  },
  {
    type: 'pets',
    question: 'What kind of cat',
    dependencies: ['two bedroom'],
    id: 'black',
    name: 'black',    
    resolve: ['foodtype']
  },

  {
    type: 'pets',
    question: 'What kind of small pet do you want?',
    dependencies: ['one bedroom'],
    id: 'mouse',
    name: 'mouse',    
    resolve: ['foodtype']
  },
  {
    type: 'pets',
    question: 'What kind of small pet do you want?',
    dependencies: ['one bedroom'],
    id: 'hamster',
    name: 'hamster',    
    resolve: ['foodtype']
  },
  {
    type: 'pets',
    question: 'What kind of small pet do you want?',
    dependencies: ['one bedroom'],
    id: 'rat',
    name: 'rat',    
    resolve: ['foodtype']
  }
];

describe('get questions tests', () => {
  it('will return the two options that have no dependencies', () => {
    expect(getQuestions(catOptions, undefined, undefined)).toStrictEqual([
      {
        type: 'house',
        question: 'how big of a house do you need?',
        dependencies: [],
        id: 'two bedroom',
        name: 'two bedroom',
        resolve: ['pets']
      },
      {
        type: 'house',
        question: 'how big of a house do you need?',
        dependencies: [],
        id: 'one bedroom',
        name: 'one bedroom',
        resolve: ['pets']
      }
    ]);
  });

  it('will return the options that have no dependencies', () => {
    expect(getQuestions(catOptions, undefined, undefined)).toStrictEqual(
      catOptions.filter((option) => option.dependencies.length === 0)
    );
  });

  it('will return just the cat questions', () => {
    const answers: ConfigOptions = [{
      type: 'house',
      question: 'how big of a house do you need?',
      dependencies: [],
      id: 'two bedroom',
      name: 'two bedroom',
      resolve: ['pets']
    }];
    
    //we're mapping the response so we don't have a huge lists
    expect(
      getQuestions(catOptions, 'pets', answers).map((options) => options.id)
    ).toStrictEqual(['yellow', 'brown', 'black']);
  });

  it('will return just the cat questions', () => {
    const answers: ConfigOptions = [{
      type: 'house',
      question: 'how big of a house do you need?',
      dependencies: [],
      id: 'one bedroom',
      name: 'one bedroom',
      resolve: ['pets']
    }];

    //we're mapping the response so we don't have a huge lists
    expect(
      getQuestions(catOptions, 'pets', answers).map((options) => options.name)
    ).toStrictEqual(['mouse', 'hamster', 'rat']);
  });
});

describe('test the default setup', () => {
  test('default inputs', async () => {
    mockedInquirer.prompt
      .mockResolvedValueOnce({ value: 'react' })
      .mockResolvedValueOnce({ value: 'scss' })
      .mockResolvedValueOnce({ value: 'chromatic' });

    expect(
      (await defaultSetup()).map((option) => option.name)
    ).toEqual(
      ['react', 'scss', 'chromatic']
    );
  });

  test('custom inputs', async () => {
    mockedInquirer.prompt
      .mockResolvedValueOnce({ value: 'one bedroom' })
      .mockResolvedValueOnce({ value: 'rat' });

    expect(
      (await defaultSetup(catOptions)).map((option) => option.name)
    ).toEqual(
      ['one bedroom', 'rat']
    );
  });

  test('custom inputs', async () => {
    mockedInquirer.prompt
      .mockResolvedValueOnce({ value: 'one bedroom' })
      .mockResolvedValueOnce({ value: 'rat' });

    expect(
      (await defaultSetup(catOptions)).map((option) => option.name)
    ).toEqual(
      ['one bedroom', 'rat']
    );
  });
});

