module.exports = {
  staticDirs: ['../projects/ds/src/docs/static'],
  "stories": [
    "../**/*.stories.mdx",
    "../**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@geometricpanda/storybook-addon-badges",
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-storysource",
    '@storybook/addon-toolbars',
    "storybook-design-token",
  ],
  "core": {
    "builder": "webpack5"
  }
}