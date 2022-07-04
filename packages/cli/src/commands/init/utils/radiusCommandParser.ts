// import inquirer from 'inquirer';

import inquirer from 'inquirer';

type ConfigOption = {
  type: string, // used in relation to resolve
  question: string, // the first option is used to display the question
  dependencies: string[], // the ids of other config options
  id: string, // the unique id of the configOption
  resolve: string[], // the list of things needed to be resolved in order
};

type ConfigOptions = ConfigOption[];

const globalConfig: ConfigOptions = [
  {
    type: 'framework',
    question: 'What framework would you like to use?',
    dependencies: [],
    id: 'react-v.0.2.9',
    resolve: ['build', 'pipeline', 'style', 'testing' ]
  },
  {
    type: 'framework',
    question: 'What framework would you like to use?',
    dependencies: [],
    id: 'angular-v.0.2.9',
    resolve: ['style','packaging','testing']
  },
  {
    type: 'style',
    question: 'Please select style',
    dependencies: [],
    id: 'react',
    resolve: []
  },
  {
    type: 'style',
    question: 'Please select style',
    dependencies: ['react-v.0.2.9'],
    id: 'react-css-modules',
    resolve: []
  },
  {
    type: 'style',
    question: '--',
    dependencies: ['react-v.0.2.9'],
    id: 'react-scss',
    resolve: []
  },
  {
    type: 'style',
    question: '--',
    dependencies: ['angular-v.0.2.9'],
    id: 'angular-scss',
    resolve: []
  },
  {
    type: 'style',
    question:'',
    dependencies: ['react-v.0.2.9'],
    id: 'react-emotion',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9' ],
    id: 'packaging-react-css-modules',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9'],
    id: 'packaging-react-css-option2',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9'],
    id:'chromatic',
    resolve: []
  },
  {
    type: 'pipeline',
    question: 'Please select deployment option',
    dependencies: ['react-v.0.2.9'],
    id: 'pipeline-react-github',
    resolve: []
  },
  {
    type: 'pipeline',
    question: 'Please select deployment option',
    dependencies: ['react-v.0.2.9'],
    id: 'other-pipeline',
    resolve: []
  },
  {
    type: 'pipeline',
    question: 'Please select deployment option',
    dependencies: ['react-v.0.2.9'],
    id: 'pipeline-react-azure',
    resolve: ['packaging']
  },
  {
    type: 'build',
    question: 'Please select deployment option',
    dependencies: ['react-v.0.2.9'],
    id: 'pipeline-react-azure',
    resolve: ['packaging']
  }
];


// const packageName: any[] = [
//   {
//     'packaging-react-css-option': '@react-css'
//   }
// ];


type ChildAnswer = {
  resolvedName: string,
  value: string,
};

type Answer = {
  selectedOption: ConfigOption,
  childAnswers: ChildAnswer[],
};

type Answers = Answer[];

export const isInDependencies = (dependencies: string[], answers: string[]) => {
  return dependencies.every((dependency) => answers.includes(dependency));
};


export const getQuestions = (
  globalOptions: ConfigOptions,
  searchForType: string | undefined,
  answers: Answers | undefined
) => {
  if (searchForType === undefined) {
    return globalOptions.filter((option) => option.dependencies.length === 0);
  }
  if (!answers) return [];
  const mappedAnswers = answers.map((answer) => answer.selectedOption.id);
  console.log('answer ids ', mappedAnswers);

  return globalOptions
    .filter((option): boolean => {
      return option.type == searchForType && isInDependencies(option.dependencies, mappedAnswers);
    });
};

export const defaultSetup = async () => {
  const resolve: string[] = [];
  const answers: Answers = [];
  return await getAllAnswers(resolve, answers, globalConfig);
};


const configOptions: ConfigOption[] = [];

const getAllAnswers = async (resolve: string[], answers: Answers, globalOptions: ConfigOptions) => {

  const foundOptions = getQuestions(globalOptions, resolve[0], answers);
  // console.log('foundOptions ', foundOptions);
  // console.log(foundOptions);
  if (foundOptions.length === 0) return answers;

  const questions = {
    name: 'value',
    type: 'list',
    choices: foundOptions.map((option) => option.id),
    message: foundOptions[0].question,
    validate: (response: string) => {
      if (response.trim().length) {
        return true;
      } else {
        return 'Please select an option';
      }
    }
  };

  const response: { value: string } = await inquirer.prompt([questions]);
  const answer = response.value.trim();

  const selectedOption: ConfigOption = foundOptions.filter((options) => options.id === answer)[0];
  answers.push({
    selectedOption,
    childAnswers: []
  });

  configOptions.push(selectedOption);


  console.log('resolve ', resolve);
  console.log('selectionOptions.resolve ', resolve);

  resolve.shift(); // remove the option we just resolved before adding the new options
  resolve = [...selectedOption.resolve, ...resolve];

  console.log('resolve after shift ', resolve);

  if (resolve.length) await getAllAnswers(resolve, answers, globalOptions);
  return answers;

};