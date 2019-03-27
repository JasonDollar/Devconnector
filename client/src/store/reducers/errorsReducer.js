import * as types from '../actions/types'

const initState = {
}

const errorsReducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_ERRORS: 
      return action.payload
    case types.CLEAR_ERRORS: 
      return {}
    default: 
      return state
  }
}

export default errorsReducer