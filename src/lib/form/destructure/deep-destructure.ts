/**
 * @description
 * Destructures a object recursively, and returns a new object with the same structure, but with the values of the original object
 * @example
 * const { a, b, c } = deepDestructure({ a: 1, b: 2, c: 3 });
 * // a = 1, b = 2, c = 3
 */

import type { GenericObject } from '../types.js';

export function deepDestructure<T extends GenericObject>(object: T | undefined): T {
	if (!object) {
		return {} as T;
	}
	return Object.keys(object).reduce((acc, key) => {
		if (typeof object[key] === 'object') {
			return { ...acc, [key]: deepDestructure(object[key] as GenericObject) };
		}
		return { ...acc, [key]: object[key] };
	}, {} as T);
}
