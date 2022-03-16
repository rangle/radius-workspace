import inquirer from 'inquirer';

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

const questions = [
	{
		name: 'ds-name',
		type: 'input',
		message: 'Enter the name of the design system:',
		validate: validateDesignSystemNameAnswer
	},
	{
		name: 'ds-framework',
		type: 'list',
		choices: ['angular', 'react', 'stencil'],
		message: 'Which framework you want to use?',
		filter
	},
	{
		name: 'ds-react-style',
		type: 'list',
		choices: ['css', 'styled-components', 'emotion'],
		message: 'How do you want to create components?',
		filter,
		when: isReact
	}
];
