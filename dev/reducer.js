import { combineReducers } from 'redux'

const initialState = {
  firstname: '',
  lastname: ''
}

const form = (state = initialState, action) => {
  if (action.type === 'UPDATE-FORM-VALUE') {
    return {
      ...state,
      [action.key]: action.value
    }
  }

  return state
}

export default combineReducers({
  form
})
