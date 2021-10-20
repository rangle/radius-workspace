// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { TextComponent } from './text.component';

export default {
  title: 'Components/Text Component',
  component: TextComponent,
} as Meta;

export const TEXT_5XL: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="5xl">
    The quick brown fox jumps over the lazy dog
  </p>`,
});

export const TEXT_4XL: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="4xl">
    The quick brown fox jumps over the lazy dog
  </p>`,
});

export const TEXT_3XL: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="3xl">
    The quick brown fox jumps over the lazy dog
  </p>`,
});

export const TEXT_2XL: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="2xl">
    The quick brown fox jumps over the lazy dog
  </p>`,
});

export const TEXT_XL: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="xl">
    The quick brown fox jumps over the lazy dog
  </p>`,
});

export const TEXT_L: Story<TextComponent> = (args: TextComponent) => ({
  props: args,
  template: `
  <p ds-text="l">
    L Text
  </p>`,
});
