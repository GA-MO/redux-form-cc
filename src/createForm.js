import React, { PureComponent } from 'react'
import { ReactReduxContext } from 'react-redux'
import injectMessage from './injectMessage'
import getFirstError from './getFirstError'
import getUIInputField from './getUIInputField'
import createHandleUpdateValue from './createHandleUpdateValue'

export default options => WrappedComponent => {
  if (!options) {
    console.error('redux-form-cc: options is requried!')
    return
  }

  const { formData, renderUIInputField } = options

  if (!formData) {
    console.error('redux-form-cc: formData is requried!')
    return
  }

  if (!renderUIInputField) {
    console.error('redux-form-cc: renderUIInputField is requried!')
    return
  }

  return class ReduxFormCC extends PureComponent {
    context = {}
    state = {
      formState: {},
      firstError: ''
    }

    unmount = false

    getFormState = () => injectMessage(formData(this.context.store.getState()))

    componentDidMount = () => {
      this.unsubscribe = this.context.store.subscribe(this.handleFormChange)

      this.setState({
        formState: this.getFormState()
      })
    }

    handleFormChange = () => {
      if (this.unmount) return

      const formState = this.getFormState()

      this.setState(() => ({
        formState: formState,
        firstError: getFirstError({
          formState,
          options,
          getState: this.context.store.getState
        })
      }))
    }

    componentWillUnmount = () => {
      this.unmount = true
      this.unsubscribe()
    }

    indirectRenderWrappedComponent = value => {
      this.context = value

      const handleUpdateValue = createHandleUpdateValue({
        formState: this.state.formState,
        dispatch: this.context.store.dispatch,
        options
      })

      const form = getUIInputField({
        formState: this.state.formState,
        handleUpdateValue,
        options
      })

      const firstError = getFirstError({
        formState: this.state.formState,
        options,
        getState: this.context.store.getState
      })

      return (
        <WrappedComponent
          {...this.props}
          formState={this.state.formState}
          form={form}
          firstError={firstError}
        />
      )
    }

    render () {
      return (
        <ReactReduxContext.Consumer>
          {this.indirectRenderWrappedComponent}
        </ReactReduxContext.Consumer>
      )
    }
  }
}
