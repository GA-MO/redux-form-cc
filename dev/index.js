import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import reduxStore from './store'
import { createForm } from '../src'

class Page extends React.Component {
  render () {
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

const formData = (state) => {
  return {
    firstname: {
      name: 'firstname',
      type: 'input',
      label: 'Firstname',
      value: state.form.firstname,
      placeholder: 'write down your firstname',
      disabled: false,
      hidden: false,
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
      disabled: false,
      hidden: false,
      rules: [
        {
          message: 'Required',
          rule: (value) => value !== ''
        }
      ]
    }
  }
}

const Input = ({ data, onChange }) => (
  <div>
    <input {...data} onChange={(e) => onChange(e.target.value)} />
    {data.errorMessage}
  </div>
)

const renderUIInputField = (fieldData, onChange) => {
  return <Input data={fieldData} onChange={onChange} />
}

const action = ({ key, value }) => (dispatch) => {
  return dispatch({
    type: 'UPDATE-FORM-VALUE',
    key,
    value
  })
}

const options = {
  action,
  formData,
  renderUIInputField
}

const App = createForm(options)(Page)

const Root = () => (
  <Provider store={reduxStore}>
    <App />
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
