import inquirer, {  QuestionCollection } from 'inquirer';

export const validateDesignSystemNameAnswer = (response: string) => {
  if (response.trim().length) {
    return true;
  } else {
    return 'Please enter the name of the design system';
  }
};

export const filter = (val: string) => {
  return val.toLowerCase();
};

export const isReact = (answers: any) => {
  return answers['ds-framework'] === 'react';
};

export const askForDesignSystemOptions = () => {
  return inquirer.prompt(questions);
};

const questions: QuestionCollection = [
  {
    name: 'ds-name',
    type: 'input',
    message: 'Enter the name of the design system:',
    validate: validateDesignSystemNameAnswer
  },
  {
    name: 'starter',
    type: 'list',
    choices: ['radius-react-vite'],
    message: 'Which project do you want to use as a base?'
    // filter
  },
  {
    name: 'segments',
    type: 'checkbox',
    choices: ['test-segment-1', 'test-segment-2', 'radius-storybook'],
    message: 'Which segments do you want to add?'
    // filter
  }
  // {
  //   name: 'ds-framework',
  //   type: 'list',
  //   choices: ['angular', 'react', 'stencil'],
  //   message: 'Which framework you want to use?',
  //   filter
  // },
  // {
  //   name: 'ds-react-style',
  //   type: 'list',
  //   choices: ['css', 'styled-components', 'emotion'],
  //   message: 'How do you want to create components?',
  //   filter,
  //   when: isReact
  // }
];
