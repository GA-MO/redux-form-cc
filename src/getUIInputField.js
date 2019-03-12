export default ({ formState, handleUpdateValue, options }) => {
  return Object.keys(formState).reduce((result, key) => {
    const onChange = value => handleUpdateValue(value, key)
    return {
      ...result,
      [key]: options.renderUIInputField(formState[key], onChange)
    }
  }, {})
}
