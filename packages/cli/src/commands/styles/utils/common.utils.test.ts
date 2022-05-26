import { toKebabCase, groupBy } from './common.utils';

describe('toKebabCase', () => {
  it('should convert from camelCase', () => {
    const res = toKebabCase('myCamelCase');
    expect(res).toBe('my-camel-case');
  });

  it('should convert from lowercase', () => {
    const res = toKebabCase('mylowercase');
    expect(res).toBe('mylowercase');
  });

  it('should convert from PascalCase', () => {
    const res = toKebabCase('MyPascalCase');
    expect(res).toBe('my-pascal-case');
  });

  it('should not explode when empty', () => {
    const res = toKebabCase('');
    expect(res).toBe('');
  });

  it('should not explode when null', () => {
    const res = toKebabCase(null as any);
    expect(res).toBe(false);
  });
});

describe('groupBy', () => {
  it('should group by type, creating an object of arrays', () => {
    const res = groupBy([
      { 'type':'a' ,'value':1 },
      { 'type':'b' ,'value':2 },
      { 'type':'a' ,'value':3 },
      { 'type':'b' ,'value':4 }
    ],'type');
    expect(res).toStrictEqual({
      'a':[
        { 'type':'a' ,'value':1 },
        { 'type':'a' ,'value':3 }
      ],
      'b':[
        { 'type':'b' ,'value':2 },
        { 'type':'b' ,'value':4 }
      ]
    });
  });
});
