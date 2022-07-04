import inquirer from 'inquirer';

type ConfigOption = {
  type: string, // used in relation to resolve
  question: string, // the first option is used to display the question
  dependencies: string[], // the ids of other config options
  id: string, // the unique id of the configOption (should be the package name)
  resolve: string[], // the list of things needed to be resolved in order
  name: string, // human readable 
};

export type ConfigOptions = ConfigOption[];

const globalConfig: ConfigOptions = [
  {
    type: 'framework',
    question: 'What framework would you like to use?',
    dependencies: [],
    id: 'react-v.0.2.9',
    name: 'react',
    resolve: ['style', 'packaging', 'testing', 'build']
  },
  {
    type: 'framework',
    question: 'What framework would you like to use?',
    dependencies: [],
    id: 'angular-v.0.2.9',
    name: 'angular',
    resolve: ['style','packaging','testing']
  },

  // styles
  {
    type: 'style',
    question: 'Please select style',
    dependencies: [],
    id: 'react',
    name:'other',
    resolve: []
  },
  {
    type: 'style',
    question: 'Please select style',
    dependencies: ['react-v.0.2.9'],
    id: 'react-css-modules',
    name:'css modules',
    resolve: []
  },
  {
    type: 'style',
    question: '--',
    dependencies: ['react-v.0.2.9'],
    id: 'react-scss',
    name:'scss',
    resolve: []
  },
  {
    type: 'style',
    question: 'Which angular style system?',
    dependencies: ['angular-v.0.2.9'],
    id: 'angular-scss',
    name: 'scss',
    resolve: []
  },
  {
    type: 'style',
    question: 'Which angular style system?',
    dependencies: ['angular-v.0.2.9'],
    id: 'angular-less',
    name: 'less',
    resolve: []
  },
  {
    type: 'style',
    question:'What react style system?',
    dependencies: ['react-v.0.2.9'],
    id: 'react-emotion',
    name: 'emotion',
    resolve: []
  },

  // packaging
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9', 'react-css-modules'],
    id: 'packaging-react-css-modules',
    name: 'packing 1',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9', 'react-css-modules'],
    id: 'packaging-react-css-option2',
    name: 'packing 2',
    resolve: []
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['react-v.0.2.9'],
    id: 'chromatic-react',
    name: 'chromatic',
    resolve: ['input-api-key']
  },
  {
    type: 'packaging',
    question: 'Please select packaging/bundle option',
    dependencies: ['angular-v.0.2.9'],
    id: 'chromatic-react',
    name: 'chromatic',
    resolve: ['input-api-key']
  }
];

export const isInDependencies = (dependencies: string[], answers: string[]) => {
  for (const index in dependencies) {
    if (!answers.includes(dependencies[index])) return false;
  }
  return true;
};

export const getQuestions = (
  globalOptions: ConfigOptions,
  searchForType: string | undefined,
  answers: ConfigOptions | undefined
) => {
  // this is for searching for the entry point
  // if we don't have a type to filter for, we return all options that don't have dependencies
  if (searchForType === undefined) {
    return globalOptions.filter((option) => option.dependencies.length === 0);
  }
  if (!answers) return [];

  // return a list of segments that match the type + dependencies list
  return globalOptions
    .filter((option) => {
      if (option.type !== searchForType) return false;
      return isInDependencies(
        option.dependencies,
        answers.map((answer) => answer.id)
      );
    }
    );
};

export const defaultSetup = async (overRideConfig?: ConfigOptions) => {
  const resolve: string[] = [];
  const answers: ConfigOptions = [];
  const options = overRideConfig ? overRideConfig : globalConfig;
  
  // we can switch out globalConfig for different data sets
  return await getAllAnswers(resolve, answers, options);
};


/* 
 * Traverses the tree of the configurations options
 * If no resolve is given
 * 
 * @param { string[] } resolve, is all the types/inputs we are looking to get answers for
 * each time we add an answer we add the answers resolves to the list (most of the time it's empty) 
 * @param { ConfigOptions } answers, all the answers we found so far, it's a ConfigOption
 * @param { ConfigOptions } globalOptions, is all the possible questions/answers
 */
const getAllAnswers = async (resolve: string[], answers: ConfigOptions, globalOptions: ConfigOptions) => {
  const foundOptions = getQuestions(globalOptions, resolve[0], answers);
  
  // when there are no options for the current question, what to do...
  if (foundOptions.length === 0) {
    // if there is nothing else to resolve end now
    if (resolve.length === 1) return answers;

    // if there is more items to be resolved, moved onto the next one
    resolve.shift();
    await getAllAnswers(resolve, answers, globalOptions);
    return answers;
  }
  // TODO if it's requesting an input, capture the input

  const questions = {
    name: 'value',
    type: 'list',
    choices: foundOptions.map((option) => option.name),
    message: foundOptions[0].question,
    validate: (response: string) => {
      if (response.trim().length) {
        return true;
      } else {
        return 'Please select an option';
      }
    }
  };

  
  const response: { value: string } = await inquirer.prompt([questions]); // get users response to the question
  const answer = response.value.trim();

  // of the current options, which one did the user select
  const selectedOption: ConfigOption = foundOptions.filter((options) => options.name === answer)[0];
  if (!selectedOption) throw new Error(`
An unselectable value of ${ answer } has been given
It does not match the options: ${ foundOptions.map((option) => option.id) }`);
  
  // TODO Answers should be flat
  answers.push(selectedOption);
  
  resolve.shift(); // remove the option we just resolved before adding the new options
  resolve = [...selectedOption.resolve, ...resolve];

  if (resolve.length) await getAllAnswers(resolve, answers, globalOptions);
  return answers;

};