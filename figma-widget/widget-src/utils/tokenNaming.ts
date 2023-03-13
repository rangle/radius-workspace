export const toKebabCase = (s: string) =>
  s
    .replace(/\./g, '-')
    .replace(/[^A-Za-z0-9_-]/g, ' ')
    .replace(/([A-Z]+)/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/--/g, '-');

// create a formatted key that's more css-friendly
export const formatKey = (str: string) => toKebabCase(str);

