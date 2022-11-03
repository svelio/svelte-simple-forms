# Svelte simple forms

Simple forms for svelte! Heavily inspired by [mantine-forms](https://github.com/mantinedev/mantine/tree/master/src/mantine-form).


## Status: Experimental

You are welcome to test the library, and support it by reporting bugs and suggesting features.

But please be aware that the API is not stable yet, and it may change in the future.

Do not expect a stable release before version 1.0.0.

## Installation

### npm

```bash
npm install --save-dev @svelio/svelte-simple-forms
```

### yarn

```bash
yarn add -D @svelio/svelte-simple-forms
```

## Usage

### Basic usage

```svelte
<script>
  import { createForm } from '@svelio/svelte-simple-forms';

  const { getInput, getForm, values } = createForm({
    initialValues: {
      name: '',
      email: '',
    }
  });
</script>

<form use:form={$values}>
  <input use:getInput={'name'} />
  <input use:getInput={'email'} />
  
  <button type="submit">Submit</button>
</form>

<p>Name: {$values.name}</p>
<p>Email: {$values.email}</p>
```

### Form validation

```svelte
<script>
  import { createForm } from '@svelio/svelte-simple-forms';

  const { getInput, getForm, values, errors } = createForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (value) => !value && 'Name is required',
      email: (value) => !value && 'Email is required',
    }
  });
</script>

<form use:form={$values}>
  <input use:getInput={'name'} />
  {#if $errors.name}
    <p>{$errors.name}</p>
  {/if}
  
  <input use:getInput={'email'} />
  {#if $errors.email}
    <p>{$errors.email}</p>
  {/if}
  
  <button type="submit">Submit</button>

    <p>Name: {$values.name}</p>
    <p>Email: {$values.email}</p>
</form>
```

### Roadmap
- [x] Basic form functionality
- [x] Form validation
- [ ] Support for custom input components (multi select, date picker, etc)
- [ ] Form validation with yup
- [ ] Form validation with zod
- [ ] Form parsing (e.g. parse string to number)
