"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askForDesignSystemOptions = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const askForDesignSystemOptions = () => {
    const questions = [{
            name: 'ds-name',
            type: 'input',
            message: 'Enter the name of the design system:',
            validate: function (value) {
                if (value.length) {
                    return true;
                }
                else {
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
            filter(val) {
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
            filter(val) {
                return val.toLowerCase();
            },
            when: function (answers) {
                return answers['ds-framework'] === 'react';
            },
        }];
    return inquirer_1.default.prompt(questions);
};
exports.askForDesignSystemOptions = askForDesignSystemOptions;
