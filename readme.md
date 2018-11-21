
# Installation
```
$ npm install redux-form-cc --save
$ yarn add redux-form-cc
```

## Step 1 : Create Form Data
```js
const formData = (state) => ({
  firstname: {
    name: 'firstname',
    type: 'input',
    label: 'Firstname',
    value: state.form.firstname,
    placeholder: 'write down your firstname',
    disabled: false,
    rules: [
      {
        message: 'Required',
        rule: (value) => value !== ''
      },
      {
        message: 'Please key "redux-form-cc"',
        rule: (value) => value === 'redux-form-cc'
      }
    ]
  },
  lastname: {
    name: 'lastname',
    type: 'input',
    label: 'Lastname',
    value: state.form.lastname,
    placeholder: 'write down your lastname',
    disabled: false
  }
})

```

## Step 2 : Create UI Input

```js
const UIInputField = ({ fieldData, onChange }) => (
  <div>
    <input {...data} onChange={(e) => onChange(e.target.value)} />
    {data.errorMessage}
  </div>
)

const renderUIInputField = (fieldData, onChange) => {
  return <UIInputField fieldData={fieldData} onChange={onChange} />
}
```

## step 3 : Create Form action
Using with `redux-thunk`
```js
const action = ({ key, value }) => dispatch => dispatch({
  type: 'UPDATE-FORM-VALUE',
  key,
  value
})

```

## Create Form with HOC
```js
import { createForm } from 'redux-form-cc'

const options = {
  action,
  formData,
  renderUIInputField
}

const ComponentWithForm = createForm(options)(Component)
```

## Create Form with Decorator
```js
import { createForm } from 'redux-form-cc'

const options = {
  action,
  formData,
  renderUIInputField
}

@createForm(options)
class Component extends React.Component {
  ...
}
```
## Render Fields
The component will has `form` and `firstError`
```js

class Component extends React.Component {
  render() {
    const { form, firstError } = this.props
    return (
      <div>
        {form.firstname}
        {form.lastname}
        {firstError}
      </div>
    )
  }
}

```
