import * as types from '../actions/types'

const initState = {
  profile: null,
  profiles: null,
  loading: false
}

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case types.PROFILE_LOADING: 
      return {
        ...state,
        loading: true,
      }
    case types.CLEAR_CURRENT_PROFILE: 
      return {
        ...state,
        profile: null,
      }
    case types.GET_PROFILE: 
      return {
        ...state,
        loading: false,
        profile: action.payload,
      }
    default: 
      return state
  }
}

export default profileReducer