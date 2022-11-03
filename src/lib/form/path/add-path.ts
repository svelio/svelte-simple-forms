/**
 * @description
 * Add or replaces a value in a path
 * @example
 * const newObject = addPath({ a: { b: { c: 1 } } }, 'a.b.d', 2);
 * // newObject = { a: { b: { c: 1, d: 2 } } }
 */

import type { GenericObject } from '../types.js';
import { set as _set } from 'lodash-es';

export function addPath<T extends GenericObject, Path extends string>(
	object: T,
	path: Path,
	value: any
): T {
	return _set(object, path, value);
}
