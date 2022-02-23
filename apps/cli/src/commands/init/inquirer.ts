import inquirer from 'inquirer';

export const askForDesignSystemOptions = () => {
  const questions = [{
    name: 'ds-name',
    type: 'input',
    message: 'Enter the name of the design system:',
    validate: function (value: string) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter name of the design system.';
      }
    }
  }, {
    name: 'ds-framework',
    type: 'list',
    choices: [
      'angular',
      'react',
      'stencil'
    ],
    message: 'Which framework you want to use?',
    filter(val: string) {
      return val.toLowerCase();
    },
  }, {
    name: 'ds-react-style',
    type: 'list',
    choices: [
      'css',
      'styled-components',
      'emotion',
    ],
    message: 'How do you want to create components?',
    filter(val: string) {
      return val.toLowerCase();
    },
    when: function (answers: any) {
      return answers['ds-framework'] === 'react';
    },
  }];
  return inquirer.prompt(questions);
};