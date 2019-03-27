import * as types from '../actions/types'
import isEmpty from '../../utils/is_empty'

const initState = {
  isAuthenticated: false,
  user: {},
}

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CURRENT_USER: {
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
    }
    default: 
      return state
  }
}

export default authReducer