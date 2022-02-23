// /* tslint:disable */
// export const getAllCSSVariables = Array.from(document.styleSheets)
//   .filter(
//     sheet =>
//       sheet.href === null || sheet.href.startsWith(window.location.origin)
//   )
//   .reduce(
//     (acc: any, sheet: any) =>
//     (acc = [
//       ...acc,
//       ...Array.from(sheet?.cssRules as any).reduce(
//         (def: any, rule: any) =>
//         (def =
//           rule?.selectorText === ":root"
//             ? [
//               ...def,
//               ...Array.from(rule?.style as any).filter((name: any) =>
//                 name.startsWith("--")
//               )
//             ] as any
//             : def as any),
//         []
//       )
//     ] as any),
//     []
//   );