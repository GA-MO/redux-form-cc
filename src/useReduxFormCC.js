import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

  const dispatch = useDispatch()
  const store = useSelector(s => s)

  const getFormState = useCallback(() => injectMessage(formData(store)), [formData, store])

  const formState = getFormState()
  const firstError = getFirstError({
    formState: formState,
    options,
    store
  })

  const handleUpdateValue = createHandleUpdateValue({
    formState,
    options,
    dispatch
  })

  return {
    formState,
    form: getUIInputField({ formState, handleUpdateValue, options }),
    firstError
  }
}

export default useReduxFormCC
