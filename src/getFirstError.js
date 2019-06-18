import isFunction from './isFunction'
import getErrorMessage from './getErrorMessage'

export default ({ formState, options, store }) => {
  const mapStateToValidationPriority = options.mapStateToValidationPriority

  if (isFunction(mapStateToValidationPriority)) {
    const priority = mapStateToValidationPriority(store)
    for (const key of priority) {
      const field = formState[key]
      if (field.hidden) return ''
      const errorMessage = getErrorMessage(field.value, field.rules)
      if (errorMessage !== '') {
        return getErrorMessage(field.value, field.rules)
      }
    }
  }

  for (const key in formState) {
    const field = formState[key]
    if (field.hidden) return ''
    const errorMessage = getErrorMessage(field.value, field.rules)
    if (errorMessage !== '') {
      return getErrorMessage(field.value, field.rules)
    }
  }

  return ''
}
