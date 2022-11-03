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

	const { dirty, values, initForm, errors, onSubmit } = createForm<typeof exampleData>({
		initialValues: exampleData,
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

	const handleSubmit = async (values: any) => console.log(values);

	$: $initForm;
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

	<form on:submit|preventDefault={(e) => onSubmit(e, $values, handleSubmit)}>
		<div>
			<label for="name">Name</label>
			<input type="text" id="name" bind:value={$values.name} class:dirty-input={$dirty.name} />
			<p>{$errors['name']}</p>
		</div>

		<div>
			<label for="age">Age</label>
			<input type="number" id="age" bind:value={$values.age} class:dirty-input={$dirty.age} />
		</div>

		<div>
			<label for="street">Street</label>
			<input
				type="text"
				id="street"
				bind:value={$values.address.street}
				class:dirty-input={$dirty.address?.street}
			/>
		</div>
		<button type="submit">Submit</button>
	</form>
</div>

<style>
	.dirty-input {
		color: turquoise;
		border: turquoise 2px solid;
		outline: none !important;
	}
</style>
