
import inquirer from 'inquirer';
import commandOptions from './commandOptions.json';

export type ConfigOption = {
  type: string, // used in relation to resolve
  question: string, // the first option is used to display the question
  dependencies: string[], // the ids of other config options
  id: string, // the unique id of the configOption (should be the package name)
  resolve: string[], // the list of things needed to be resolved in order, if the resolve starts with 'input' it will be treated as a text input
  name: string, // human readable 
  value?: string, // if there was a response to a quest it gets stored as a value
};
const globalConfig  = commandOptions.options as ConfigOption[];

// TODO if come to same question again don't ask the question a 2nd time
// TODO assume it's an input if not found, don't have 2nd requirment
// TODO IDEA look into using package + version, or a more open ended dependencies - 
//     Optional version?
//     Look at how NPM is using the versioning <= nmp is using perfect
// TODO weighting
// TODO default paths

// TODO can we use git patch? - what does that look like?
// Test locally all the combinations of what we build

// TODO Radius can be used to used to create new components
// TODO Radius can be used to build?

// TODO Radius Contrib - so users can feed back into radius segments
// TODO Radius Contrib - a URL of additional global configs (add it to our list)
// TODO Radius Contrib - How do we have new devs - understand how to add content (give check lists on how add things)



// const globalConfig: ConfigOption[] = [
//   {
//     type: 'configfile',
//     question: 'What config file do you want to use?',
//     dependencies: [],
//     id: 'react-v.0.2.9',
//     name: 'react',
//     resolve: []
//   },

// ]








export const isInDependencies = (dependencies: string[], answers: string[]) => {
  return dependencies.every((dependency) => answers.includes(dependency));
};


export const getQuestions = (
  globalOptions: ConfigOption[],
  searchForType: string | undefined,
  answers: ConfigOption[] | undefined
) => {
  // this is for searching for the entry point
  // if we don't have a type to filter for, we return all options that don't have dependencies
  if (searchForType === undefined) {
    return globalOptions.filter((option) => option.dependencies.length === 0);
  }
  if (!answers) return [];
  const mappedAnswers = answers.map((answer) => answer.id);

  // return a list of segments that match the type + dependencies list
  return globalOptions
    .filter((option): boolean => {
      return option.type == searchForType && isInDependencies(option.dependencies, mappedAnswers);
    });
};

export const defaultSetup = async (overRideConfig?: ConfigOption[]) => {
  const resolve: string[] = [];
  const answers: ConfigOption[] = [];
  const options = overRideConfig ? overRideConfig : globalConfig;
  
  // we can switch out globalConfig for different data sets
  return await getAllAnswers(resolve, answers, options);
};


const getAnswerFromOptions = async (options: ConfigOption[]) => {
  const questions = {
    name: 'value',
    type: 'list',
    choices: options.map((option) => option.name),
    message: options[0].question,
    validate: (response: string) => {
      if (response.trim().length) {
        return true;
      } else {
        return 'Please select an option';
      }
    }
  };
  
  const response: { value: string }|undefined = await inquirer.prompt([questions]); // get users response to the question
  const answer = response?.value.trim();

  // of the current options, which one did the user select
  const selectedOption: ConfigOption = options.filter((selectOptions) => selectOptions.name === answer)[0];
  if (!selectedOption) throw new Error(`
An unselectable value of ${ answer } has been given
It does not match the options: ${ options.map((option) => option.name) }`);
  return selectedOption;
};

const getAnswerFromInput = async (resolve: string) => {
  const questions = {
    name: 'value',
    type: 'input',
    message: resolve.slice(5)
  };

  const response: { value: string } = await inquirer.prompt([questions]);

  return {
    type: 'input',
    id: resolve,
    question: '',
    dependencies: [],
    resolve: [],
    name: '',
    value: response.value
  } as ConfigOption;
};

/* 
 * Traverses the tree of the configurations options
 * If no resolve is given
 * 
 * @param { string[] } resolve, is all the types/inputs we are looking to get answers for
 * each time we add an answer we add the answers resolves to the list (most of the time it's empty) 
 * @param { ConfigOption[] } answers, all the answers we found so far, it's a ConfigOption
 * @param { ConfigOption[] } globalOptions, is all the possible questions/answers
 * 
 * Returns { ConfigOptions[] } a list of all the configurations options that was selected and all inputs as configOptions with a value 
 */
const getAllAnswers = async (resolve: string[], answers: ConfigOption[], globalOptions: ConfigOption[]) => {
  const foundOptions = getQuestions(globalOptions, resolve[0], answers);
  const isAnInput = resolve[0]?.slice(0, 5) === 'input';

  // console.log(resolve[0], foundOptions.length, isAnInput, answers.map((option)=>option.name));

  // when there are no options for the current question, what to do...
  if (foundOptions.length === 0 && !isAnInput) {

    // if there is nothing else to resolve end now
    if (resolve.length === 1) return answers;

    // if there is more items to be resolved, moved onto the next one
    resolve.shift();
    await getAllAnswers(resolve, answers, globalOptions);
    return answers;
  }
  
  const selectedOption = isAnInput
    ? await getAnswerFromInput(resolve[0])
    : await getAnswerFromOptions(foundOptions);
  
  answers.push(selectedOption);
  
  resolve.shift(); // remove the option we just resolved before adding the new options
  resolve = [...selectedOption.resolve, ...resolve];

  if (resolve.length) await getAllAnswers(resolve, answers, globalOptions);
  return answers;

};