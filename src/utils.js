const validateRules = (value, rules = []) => {
  let errorMessage = ''
  for (let i = 0; i < rules.length; i++) {
    const hasRule = rules[i].hasOwnProperty('rule')
    if (hasRule && !rules[i].rule(value)) {
      errorMessage = rules[i].message
      break
    }
  }
  return errorMessage
}

export { validateRules }
