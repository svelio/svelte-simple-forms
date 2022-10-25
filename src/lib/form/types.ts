export type Primitive = string | number | symbol;

/**
 * @description
 * A type that represents a path to a property in an object.
 * We use this because we can only index objects with strings, numbers or symbols.
 */
export type GenericObject = Record<Primitive, unknown>;

/**
 * TypeFromPath
 * @description Get the type of a value at a given path
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
	T extends GenericObject,
	Path extends string // Or, if you prefer, NestedPaths<T>
> = {
	[K in Path]: K extends keyof T
		? T[K]
		: K extends `${infer P}.${infer S}`
		? T[P] extends GenericObject
			? TypeFromPath<T[P], S>
			: never
		: never;
}[Path];

/**
 * NestedKeyOf
 * @description
 * Gets all the nested keys of an object
 * @example
 * type NestedKeysOfAB = NestedKeysOf<{ name: string, address: {street: string, city: string} }>
 * // 'name' | 'address.street' | 'address.city'
 */
export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`;
}[keyof ObjectType & (string | number)];

export type ValidationFunction<Value extends GenericObject, Path extends string> = (
	value: TypeFromPath<Value, Path>
) => string | undefined;

export type ValidationObject<T extends GenericObject> = {
	[K in NestedKeyOf<T>]: ValidationFunction<T, K>;
};

export type CreateFormInput<Values extends GenericObject> = {
	initialValues: Values;
	validate: Partial<ValidationObject<Values>>;
};

const testData = {
	name: 'John',
	address: {
		street: '123 Main St',
		city: 'Anytown',
		state: 'CA'
	}
};

const CreateFormInputs: CreateFormInput<typeof testData> = {
	initialValues: testData,
	validate: {}
};
