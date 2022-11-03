// TODO
// - [ ] create a form component that uses a writeable store, with validation

import { writable } from 'svelte/store';
import { deepDestructure } from './destructure/deep-destructure.js';
import { addPath } from './path/add-path.js';
import type { Errors, CreateFormInput, GenericObject, NestedKeyOf } from './types.js';
import { get as _get } from 'lodash-es';

export function createForm<Values extends GenericObject>({
	initialValues,
	initialDirty,
	initialErrors,
	validate,
	classes
}: CreateFormInput<Values>) {
	const values = writable<Values>(deepDestructure(initialValues));
	const touched = writable(deepDestructure(initialDirty) || {});
	const dirty = writable({
		...replaceValues(initialValues, false),
		...deepDestructure(initialDirty)
	});
	const errors = writable<Errors<Values>>({
		...replaceValues(initialValues, null),
		...deepDestructure(initialErrors)
	});

	// function that copies and object, and sets all values to null. Make sure we also get all the nested keys
	function replaceValues(object: any, newValue: any): any {
		const emptyObject: any = {};
		for (const key of Object.keys(object)) {
			emptyObject[key] =
				object[key] instanceof Object ? replaceValues(object[key], newValue) : newValue;
		}
		return emptyObject;
	}

	const setDirty = (path: string, node?: HTMLInputElement) => {
		dirty.update((current) => {
			if (_get(current, path)) {
				return current;
			}
			if (classes?.dirty && node) {
				node.classList.add(classes.dirty);
			}
			return addPath(current, path, true);
		});
	};

	const setError = (path: string, error: string | null | undefined, node?: HTMLInputElement) => {
		errors.update((current) => {
			if (_get(current, path) === error) {
				return current;
			}
			if (classes?.error && node && error) {
				node.classList.add(classes.error);
			} else if (classes?.error && node && !error) {
				node.classList.remove(classes.error);
			}
			return addPath(current, path, error);
		});
	};

	const setTouched = (path: string, node?: HTMLInputElement) => {
		touched.update((current) => {
			if (_get(current, path)) {
				return current;
			}
			if (classes?.touched && node) {
				node.classList.add(classes.touched);
			}
			return addPath(current, path, true);
		});
	};

	const deepKeys = (obj: GenericObject, prefix = '') => {
		return Object.keys(obj).reduce((acc, k) => {
			const pre = prefix.length ? prefix + '.' : '';
			if (typeof obj[k] === 'object') {
				acc.push(...deepKeys(obj[k] as GenericObject, pre + k));
			} else {
				acc.push(pre + k);
			}
			return acc;
		}, [] as string[]);
	};

	const flattenDeep = (obj: GenericObject, prefix = '') => {
		return Object.keys(obj).reduce((acc, k) => {
			const pre = prefix.length ? prefix + '.' : '';
			if (typeof obj[k] === 'object') {
				acc = { ...acc, ...flattenDeep(obj[k] as GenericObject, pre + k) };
			} else {
				acc[pre + k] = obj[k];
			}
			return acc;
		}, {} as GenericObject);
	};

	const validateField = (path: NestedKeyOf<Values>, value: any) => {
		const validation = validate && validate[path];
		if (validation) {
			const error = validation(value);
			return error;
		}
		return null;
	};

	/**
	 *
	 * @param e Event
	 * @param $values Values (subscribed)
	 * @param onSubmit Callback function
	 * @returns
	 * void
	 * @example
	 * ```svelte
	 * <form on:submit|preventDefault={(e) => onSubmit(e, $values, (data) => console.log(data))}></form>
	 * ```
	 */
	const onSubmit = async (
		e: Event,
		$values: Values,
		handleSubmit: (data: Values) => unknown | Promise<unknown>
	) => {
		// TODO: add zod-validation
		e.preventDefault();
		const hadError = false; //validateAllFields($values);
		if (hadError) {
			return;
		}
		handleSubmit($values);
	};

	const handleInput = (e: any, path: NestedKeyOf<Values>) => {
		const value = (e.target as HTMLInputElement).value;
		setError(path, validateField(path, value), e.target);
		setDirty(path, e.target);
		setTouched(path, e.target);
		values.update((current) => {
			return addPath(current, path, (e.target as HTMLInputElement).value);
		});
	};

	const getInput = (node: HTMLInputElement, path: NestedKeyOf<Values>) => {
		node.addEventListener('input', (e) => handleInput(e, path));
		node.value = _get(initialValues, path);
		node.id = path;
		return {
			update(path: string) {
				node.id = path;
			},
			destroy() {
				node.removeEventListener('input', (e) => handleInput(e, path));
			}
		};
	};

	const onSubmitHandler = (e: Event, $values: Values) => {
		onSubmit(e, $values, () => {
			console.log('submit', $values);
		});
	};

	const getForm = (node: HTMLFormElement, $values: Values) => {
		// create id, by joining all the keys with a dash
		console.log('getForm', deepKeys(initialValues).join('-'));
		node.id = deepKeys(initialValues).join('-');
		node.addEventListener('submit', (e) => onSubmitHandler(e, $values));
		return {
			update() {
				return;
			},
			destroy() {
				return;
			}
		};
	};

	return {
		values,
		dirty,
		errors,
		onSubmit,
		getInput,
		getForm
	};
}
