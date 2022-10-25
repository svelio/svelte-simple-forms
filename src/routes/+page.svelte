<script lang="ts">
	const exampleData = {
		name: 'John',
		age: 30,
		address: {
			street: '123 Main St',
			city: 'New York'
		}
	};
	import { createForm } from '../lib/form';

	const myForm = createForm();
</script>

<div style="display: flex; flex-direction: column; gap: .25rem">
	<!--<div>
		<p>Values: {JSON.stringify($values, null, 2)}</p>
	</div>
	<div>
		<p>Errors: {JSON.stringify($errors, null, 2)}</p>
	</div>
	<div>
		<p>Dirty: {JSON.stringify($dirty, null, 2)}</p>
	</div>
	<div>
		<p>Touched: {JSON.stringify($touched, null, 2)}</p>
	</div>-->

	<!--<div>
		<label for="name">Name</label>
		<input type="text" id="name" bind:value={$values.name} />
	</div>

	<div>
		<label for="age">Age</label>
		<input type="number" id="age" bind:value={$values.age} />
	</div>

	<div>
		<label for="street">Street</label>
		<input type="text" id="street" bind:value={$values.address.street} />
	</div>-->
</div>
