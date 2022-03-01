import { toKebabCase } from "./common.utils";

describe("toKebabCase", () => {
  it("should convert from camelCase", () => {
    const res = toKebabCase("myCamelCase");
    expect(res).toBe("my-camel-case");
  });
  it("should convert from lowercase", () => {
    const res = toKebabCase("mylowercase");
    expect(res).toBe("mylowercase");
  });
  it("should convert from PascalCase", () => {
    const res = toKebabCase("MyPascalCase");
    expect(res).toBe("my-pascal-case");
  });
  it("should not explode when empty", () => {
    const res = toKebabCase("");
    expect(res).toBe("");
  });
  it("should not explode when null", () => {
    const res = toKebabCase(null as any);
    expect(res).toBe(false);
  });
});
