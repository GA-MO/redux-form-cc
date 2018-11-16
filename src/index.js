import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { validateRules } from './utils'

const isFunction = (func) => func && typeof func === 'function'
const getErrorMessage = (value, rules) => validateRules(value, rules)

const createForm = (options) => (WrappedComponent) => {
  if (!options) {
    console.error('redux-form-cc: options is requried!')
    return
  }

  const {
    action = undefined,
    formData = undefined,
    renderUIInputField = undefined,
    mapStateToValidationPriority = []
  } = options

  if (!formData) {
    console.error('redux-form-cc: formData is requried!')
    return
  }

  if (!renderUIInputField) {
    console.error('redux-form-cc: renderUIInputField is requried!')
    return
  }

  return class ReduxFormCC extends PureComponent {
    static contextTypes = {
      store: PropTypes.shape({})
    }

    state = {
      formData: {},
      firstError: ''
    }

    unmount = false

    getFormData = () => {
      const { getState } = this.context.store
      return formData(getState(), this.props)
    }

    componentDidMount = () => {
      this.unsubscribe = this.context.store.subscribe(this.handleFormChange)

      this.setState({
        formData: this.getFormData()
      })
    }

    handleFormChange = () => {
      if (this.unmount) return

      this.setState((s) => ({
        formData: this.getFormData(),
        firstError: this.getFirstError()
      }))
    }

    componentWillUnmount = () => {
      this.unmount = true
      this.unsubscribe()
    }

    handleUpdateValue = (value, key) => {
      const { dispatch } = this.context.store
      const formData = this.getFormData()
      const field = formData[key]

      if (!field) {
        console.error(
          `redux-form-cc: Cannot get field in formData at key '${key}'. Please recheck your formData`
        )
        return
      }

      const fieldAction = field.action || action
      if (!fieldAction) {
        console.error('redux-form-cc: action is required!')
        return
      }

      dispatch(fieldAction({ key, value }))
    }

    getUIInputField = () => {
      const formData = this.getFormData()

      return Object.keys(formData).reduce((result, key) => {
        const field = formData[key]
        field.errorMessage = getErrorMessage(field.value, field.rules)
        const onChange = (value) => this.handleUpdateValue(value, key)

        return {
          ...result,
          [key]: renderUIInputField(field, onChange)
        }
      }, {})
    }

    getFirstError = () => {
      const formData = this.getFormData()

      if (isFunction(mapStateToValidationPriority)) {
        const { getState } = this.context.store
        const priority = mapStateToValidationPriority(getState())
        for (const key of priority) {
          const field = formData[key]
          if (field.hidden) return ''
          const errorMessage = getErrorMessage(field.value, field.rules)
          if (errorMessage !== '') {
            return getErrorMessage(field.value, field.rules)
          }
        }
      }

      for (const key in formData) {
        const field = formData[key]
        if (field.hidden) return ''
        const errorMessage = getErrorMessage(field.value, field.rules)
        if (errorMessage !== '') {
          return getErrorMessage(field.value, field.rules)
        }
      }

      return ''
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          form={this.getUIInputField()}
          firstError={this.getFirstError()}
        />
      )
    }
  }
}

export { createForm }
