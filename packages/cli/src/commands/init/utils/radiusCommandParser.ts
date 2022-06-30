import inquirer from 'inquirer';

type ConfigOption = {
  type: string, // used in relation to resolve
  question: string, // the first option is used to display the question
  dependencies: string[], // the ids of other config options
  id: string, // the unique id of the configOption
  resolve: string[], // the list of things needed to be resolved in order
};

export type ConfigOptions = ConfigOption[];

const globalConfig: ConfigOptions = [
  {
    type: 'framework',
    question: 'What framework would you like to use?',
    dependencies: [],
    id: 'react-v.0.2.9',
    resolve: ['style', 'packaging', 'testing', 'build']
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
    dependencies: ['react-v.0.2.9', 'react-css-modules'],
    id: 'packaging-react-css-modules',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9', 'react-css-modules'],
    id: 'packaging-react-css-option2',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9', 'react-scss'],
    id:'chromatic',
    resolve: ['input-apikey']
  }
];


type ChildAnswer = {
  resolvedName: string,
  value: string,
};

type Answer = {
  selectedOption: ConfigOption,
  childAnswers: ChildAnswer[],
};

export type Answers = Answer[];


export const isInDependencies = (dependencies: string[], answers: string[]) => {
  for (const index in dependencies) {
    if (!answers.includes(dependencies[index])) return false;
  }
  return true;
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

  return globalOptions
    .filter((option) => {
      if (option.type !== searchForType) return false;
      return isInDependencies(option.dependencies, answers.map((answer) => answer.selectedOption.id));
    }
    );
};

export const defaultSetup = async (overRideConfig?: ConfigOptions) => {
  const resolve: string[] = [];
  const answers: Answers = [];
  const options = overRideConfig ? overRideConfig : globalConfig;
  
  // we can switch out globalConfig for different data sets
  return await getAllAnswers(resolve, answers, options);
};


// traverses the tree
const getAllAnswers = async (resolve: string[], answers: Answers, globalOptions: ConfigOptions) => {
  const foundOptions = getQuestions(globalOptions,resolve[0], answers);
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
  console.log(response);
  const answer = response.value.trim();

  const selectedOption: ConfigOption = foundOptions.filter((options) => options.id === answer)[0];
  answers.push({
    selectedOption,
    childAnswers: []
  });
  
  resolve.shift(); // remove the option we just resolved before adding the new options
  resolve = [...selectedOption.resolve, ...resolve];

  if (resolve.length) await getAllAnswers(resolve, answers, globalOptions);
  return answers;

};