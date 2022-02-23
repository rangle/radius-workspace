import { Story, Meta } from '@storybook/angular/types-6-0';
import { BADGE } from '@geometricpanda/storybook-addon-badges';

import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs'

import { ButtonComponent } from './button.component';

const icon = `<svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
</svg>`;

export default {
  title: 'Components/Button',
  viewMode: 'docs',
  parameters: {
    badges: [BADGE.BETA],
  },
  argTypes: {
    selector: {
      table: {
        disable: true
      }
    },
    _classNames: {
      table: {
        disable: true
      }
    },
    label: {
      type: 'string',
      description: 'Button Label',
      defaultValue: 'Button'
    },
  },
  component: ButtonComponent,
} as Meta;

const Template: Story = (args) => {
  return {
    props: args,
    template: `
      <button ds-button variant="${args.variant}" size="${args.size}">
        ${args.label}
      </button>`,
  }
};

export const Default = Template.bind({});
Default.args = {
  label: 'Primary Medium Button',
  size: 'medium',
  variant: 'primary'
}

export const Variants = () => {
  return {
    template: `
      <div style="display: flex; justify-content: space-between;">
        <button ds-button variant="primary">
          Primary Button
        </button>
        &nbsp;&nbsp;
        <button ds-button variant="secondary">
          Secondary Button
        </button>
        &nbsp;&nbsp;
        <button ds-button variant="chevron">
          Chevron Button
        </button>
        &nbsp;&nbsp;
        <button ds-button variant="icon">
          ${icon}
        </button>
      </div>`,
  }
}

export const Sizes = () => {
  return {
    template: `
      <div style="display: flex; justify-content: space-between;">
        <button ds-button size="small" variant="primary">
          Small Button
        </button>
        <button ds-button size="medium" variant="primary">
          Medium Button
        </button>
        <button ds-button size="large" variant="primary">
          Large Button
        </button>
      </div>`,
  }
}
