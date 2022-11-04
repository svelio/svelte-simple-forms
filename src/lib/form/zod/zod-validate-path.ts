export default function ZodValidatePath<T>(zodSchema: any, path: string, value: any) {
	// validate the path. ex 'address.street', for every key in the path, it should have a shape - this is recursive
	const pathKeys = path.split('.');
	let currentSchema = zodSchema;
	for (const key of pathKeys) {
		if (currentSchema.shape[key]) {
			currentSchema = currentSchema.shape[key];
		} else {
			throw new Error(`Path ${path} is not valid`);
		}
	}

	// validate the value
	const result = currentSchema.safeParse(value);
	if (!result.success) {
		return result.error.errors[0].message;
	} else {
		return null;
	}
}
