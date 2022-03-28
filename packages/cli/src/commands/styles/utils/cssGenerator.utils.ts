//console.log(Object.fromEntries(keyValuePairs));

export const generateColorsCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.color.map((color: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds-color${color.token.substring(8).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = color.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};

export const generateTypographyCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.typography.map((typography: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds${typography.token.substring(1).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = typography.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};

export const generateSpacingCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.spacing.map((spacing: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds${spacing.token.substring(1).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = spacing.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};

export const generateElevationCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.elevation.map((elevation: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds${elevation.token.substring(1).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = elevation.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};

export const generateBreakpointCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.breakpoint.map((breakpoint: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds${breakpoint.token.substring(1).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = breakpoint.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};

export const generateGridCSS = (tokenMap: any) => {
  const keyValuePairs = tokenMap.grid.map((grid: { token: string; value: string; }) => {
    // eslint-disable-next-line
    const key = `-ds${grid.token.substring(1).trim().replaceAll("'", '')}`;
    // eslint-disable-next-line
    const value = grid.value.replaceAll("'", '');
    return [key, value];
  });
  return Object.fromEntries(keyValuePairs);
};
