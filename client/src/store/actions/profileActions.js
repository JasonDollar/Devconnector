import axios from 'axios'
// import jwt_decode from 'jwt-decode'
// import history from '../../history'
import * as types from './types'

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading())
  axios.get('/api/profile')
    .then(res => {
      dispatch({
        type: types.GET_PROFILE,
        payload: res.data,
      })
    })
    .catch(err => {
      dispatch({
        type: types.GET_PROFILE,
        payload: {},
      })
    })
}

export const setProfileLoading = () => ({
  type: types.PROFILE_LOADING
})

export const clearProfile = () => ({
  type: types.CLEAR_CURRENT_PROFILE
})