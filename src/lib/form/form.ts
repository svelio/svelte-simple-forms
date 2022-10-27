// TODO
// - [ ] create a form component that uses a writeable store, with validation

import { derived, writable } from 'svelte/store';
import { deepDestructure } from './destructure/deep-destructure';
import { addPath } from './path/add-path';
import type { CreateFormInput, GenericObject, NestedKeyOf } from './types';
import { get as _get } from 'lodash';

export function createForm<Values extends GenericObject>({
	initialValues,
	initialDirty,
	validate
}: CreateFormInput<Values>) {
	const values = writable<Values>(deepDestructure(initialValues));
	const dirty = writable(deepDestructure(initialDirty) || {});
	const errors = writable<Partial<Record<NestedKeyOf<Values>, string>>>(deepDestructure({}));

	const setDirty = (path: string) => {
		dirty.update((current) => {
			return addPath(current, path, true);
		});
	};

	const setError = (path: string, error: string | null | undefined) => {
		errors.update((current) => {
			return addPath(current, path, error);
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

	const validateField = (path: NestedKeyOf<Values>, values: Values) => {
		const validation = validate && validate[path];
		if (validation) {
			const value = _get(values, path);
			const error = validation(value);
			return error;
		}
		return null;
	};

	const validateAllFields = ($values: Values) => {
		let hadError = false;
		deepKeys($values).forEach((key: any) => {
			if (flattenDeep($values)[key] != flattenDeep(initialValues)[key]) {
				const result = validateField(key, $values);
				setDirty(key);
				setError(key, result);
				if (!hadError && result) {
					hadError = true;
				}
			}
		});
		return hadError;
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
		const hadError = validateAllFields($values);
		if (hadError) {
			return;
		}
		handleSubmit($values);
	};

	const initForm = derived([values], ([$values]) => {
		validateAllFields($values);
	});

	return {
		values,
		dirty,
		errors,
		initForm,
		onSubmit
	};
}
