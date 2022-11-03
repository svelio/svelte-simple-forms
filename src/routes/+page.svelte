<script lang="ts">
	const exampleData = {
		name: 'John',
		age: 30,
		address: {
			street: '123 Main St',
			city: 'New York'
		}
	};
	import { createForm } from '../lib/form/form.js';

	const { dirty, values, errors, onSubmit, getInput, getForm } = createForm<typeof exampleData>({
		initialValues: exampleData,
		classes: {
			error: 'error-input'
		},
		validate: {
			'address.city': (value) => {
				if (value.length < 3) {
					return 'City must be at least 3 characters';
				}
				return null;
			},
			'address.street': (value) => {
				if (value.length < 3) {
					return 'Street must be at least 3 characters';
				}
				return null;
			},
			name: (value) => {
				if (!value) {
					return 'Name is required';
				}
				if (value.length < 3) {
					return 'Name must be at least 3 characters';
				}
				return null;
			},
			age: (value) =>
				(value < 2 && 'Come on, how young are you?') ||
				(value < 18 && 'You must be at least 18 years old') ||
				null
		}
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
