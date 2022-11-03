import type { GenericObject } from '../types.js';

/**
 * @description
 * Removes a value from a path
 * @example
 * const newObject = removePath({ a: { b: { c: 1 } } }, 'a.b.c');
 * // newObject = { a: { b: {} } }
 * @param path
 * @param value
 */
export function removePath<T extends GenericObject, Path extends string>(object: T, path: Path): T {
	const pathArray = path.split('.');
	const lastKey = pathArray.pop();
	const lastPath = pathArray.reduce((acc, key) => {
		return { ...acc, [key]: {} };
	}, {});
	return { ...object, ...lastPath, [lastKey!]: undefined };
}
