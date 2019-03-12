import { useState, useEffect, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import injectMessage from './injectMessage'
import getFirstError from './getFirstError'
import getUIInputField from './getUIInputField'
import createHandleUpdateValue from './createHandleUpdateValue'

const useReduxFormCC = options => {
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

  const { store } = useContext(ReactReduxContext)

  const getFormState = () => injectMessage(formData(store.getState()))

  const initFormState = getFormState()
  const initFirstError = getFirstError({
    formState: initFormState,
    options,
    getState: store.getState
  })

  const [formState, setFormState] = useState(initFormState)
  const [firstError, setFirstError] = useState(initFirstError)
  const [unmount, setUnmount] = useState(false)

  useEffect(() => {
    const handleFormChange = () => {
      if (unmount) return

      const newFormState = getFormState()
      const newFirstError = getFirstError({
        formState: newFormState,
        options,
        getState: store.getState
      })

      setFormState(newFormState)
      setFirstError(newFirstError)
    }

    const unsubscribe = store.subscribe(handleFormChange)
    return () => {
      unsubscribe()
      setUnmount(true)
    }
  }, [])

  const handleUpdateValue = createHandleUpdateValue({
    formState,
    options,
    dispatch: store.dispatch
  })

  return {
    formState,
    form: getUIInputField({ formState, handleUpdateValue, options }),
    firstError
  }
}

export default useReduxFormCC
