import { logger } from '../../../logger';

export type GroupOf<
  T,
  K extends keyof T,
  V extends string = T[K] extends string ? Extract<T[K], string> : never
> = Record<V, T[]>;

export const groupBy = <T, K extends keyof T>(
  list: T[],
  key: K
): GroupOf<T, K> =>
  list.reduce((res, item) => {
    const value = item[key];
    if (typeof value !== 'string') return res;
    const previous = res[value as keyof typeof res] || [];
    return {
      ...res,
      [value]: [...previous, item]
    };
  }, {} as GroupOf<T, K>);

export const mapKeys =
	<T>(ks: ReadonlyArray<keyof T>) =>
	  (o: T) =>
	    ks.map((key) => [key, o[key]] as const);

/** toKebabCase
 * Converts text in CamelCase to kebab-case
 */
export const toKebabCase = (s: string) =>
  typeof s === 'string' &&
	s
	    .split('')
	    .map((letter, idx) =>
	        letter.toUpperCase() === letter
	            ? `${ idx !== 0 ? '-' : '' }${ letter.toLowerCase() }`
	            : letter
	    )
	    .join('');

export const assert = <T>(x: T, msg?: string) => {
  if (!x) {
    if (typeof msg === 'string') {
      logger.error(msg);
    }
    process.exit(1);
  }
};

