<script lang="ts">
	import { z } from 'zod';
	import { createForm } from '../lib/form/form.js';

	const exampleData = {
		name: 'John',
		age: 30,
		address: {
			street: '123 Main St',
			city: 'New York'
		}
	};

	const { dirty, values, errors, onSubmit, getInput, getForm } = createForm<typeof exampleData>({
		initialValues: exampleData,
		classes: {
			error: 'error-input'
		},
		zodValidate: z.object({
			name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
			age: z.number().min(18, { message: 'Must be at least 18 years old' }),
			address: z.object({
				street: z.string().min(5, { message: 'Street must be at least 5 characters' }),
				city: z.string().min(3)
			})
		})
	});
</script>

<div style="display: flex; flex-direction: column; gap: .25rem">
	<div>
		<p>Values: {JSON.stringify($values, null, 2)}</p>
	</div>
	<div>
		<p>Errors: {JSON.stringify($errors, null, 2)}</p>
	</div>
	<div>
		<p>Dirty: {JSON.stringify($dirty, null, 2)}</p>
	</div>

	<form use:getForm={$values}>
		<div>
			<label for="name">Name</label>
			<input use:getInput={'name'} type="text" />
		</div>

		<div>
			<label for="age">Age</label>
			<input use:getInput={'age'} type="number" />
		</div>

		<div>
			<label for="street">Street</label>
			<input type="text" use:getInput={'address.street'} />
		</div>
		<button type="submit">Submit</button>
	</form>
	<div class="error-input" />
</div>

<style>
	.dirty-input {
		color: turquoise;
		border: turquoise 2px solid;
		outline: none !important;
	}

	.error-input {
		color: red;
		border: red 2px solid;
		outline: none !important;
	}
</style>
