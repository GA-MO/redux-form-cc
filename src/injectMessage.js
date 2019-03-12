import getErrorMessage from './getErrorMessage'

export default formState => {
  for (const key in formState) {
    const field = formState[key]
    field.message = getErrorMessage(formState[key].value, formState[key].rules)
    formState = { ...formState, [key]: field }
  }
  return formState
}
