/**
 * @description
 * Creates a path from a string
 * @example
 * const path = createPath('a.b.c', true);
 * // path = { a: { b: { c: true } } }
 * @param path
 * @param value
 */
export function createPath(path: string, value: any) {
	const pathArray = path.split('.');
	const lastKey = pathArray.pop();
	const lastPath = pathArray.reduce((acc, key) => {
		return { ...acc, [key]: {} };
	}, {});
	return { ...lastPath, [lastKey!]: value };
}
