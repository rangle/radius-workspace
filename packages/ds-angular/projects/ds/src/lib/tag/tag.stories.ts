import { Story, Meta } from '@storybook/angular/types-6-0';
import { BADGE } from '@geometricpanda/storybook-addon-badges';

import { TagComponent } from './tag.component';

export default {
  title: 'Components/Tag',
  viewMode: 'docs',
  parameters: {
    badges: [BADGE.STABLE],
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
      description: 'Tag Text',
      defaultValue: 'Tag'
    },
  },
  component: TagComponent,
} as Meta;

const Template: Story = (args) => {
  return {
    props: args,
    template: `
      <ds-tag type="${args.type}" variant="${args.variant}">
        ${args.label}
      </ds-tag>`,
  }
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Tag',
  type: 'primary'
}

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secondary Tag',
  type: 'secondary'
}

export const Error = Template.bind({});
Error.args = {
  label: 'Error Tag',
  type: 'error'
}

export const Success = Template.bind({});
Success.args = {
  label: 'Success Tag',
  type: 'success'
}

export const Alert = Template.bind({});
Alert.args = {
  label: 'Alert Tag',
  type: 'alert'
}
