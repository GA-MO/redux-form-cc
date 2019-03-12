export default ({ formState, options, dispatch }) => (value, key) => {
  const field = formState[key]

  if (!field) {
    console.error(
      `redux-form-cc: Cannot get field in formData at key '${key}'. Please recheck your formData`
    )
    return
  }

  const fieldAction = field.action || options.action
  if (!fieldAction) {
    console.error('redux-form-cc: action is required!')
    return
  }

  dispatch(fieldAction({ key, value }))
}
