import { colorToHex } from './figma.utils';

describe('colorToHex', () => {
  it('should return Hex from colour', () =>{
    expect(colorToHex({ r:0,g:0,b:0 })).toBe('#000000');
  });
});
  