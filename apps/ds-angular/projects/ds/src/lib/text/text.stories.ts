// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { BADGE } from '@geometricpanda/storybook-addon-badges';

import { TextComponent } from './text.component';

const DUMMY_TEXT = 'The quick brown fox jumps over the lazy dog';

export default {
  title: 'Components/Text',
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
  },
  text: {
    type: 'string',
    defaultValue: DUMMY_TEXT
  },
  component: TextComponent,
} as Meta;

const Template: Story = (args) => {
  return {
    props: args,
    template: `<h1 ds-text size="${args.size}">${args.text}</h1>`,
  }
};

export const Heading = Template.bind({});
Heading.args = {
  text: DUMMY_TEXT,
  size: '5xl'
}

export const Paragraph = Template.bind({});
Paragraph.args = {
  text: DUMMY_TEXT,
  size: 'm'
}
