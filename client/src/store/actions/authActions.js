import axios from 'axios'
import jwt_decode from 'jwt-decode'
import history from '../../history'
import * as types from './types'
import setAuthToken from '../../utils/setAuthToken'

export const registerUser = (userData, history) => async dispatch => {
  dispatch({
    type: types.CLEAR_ERRORS
  })
  try {
    const res = await axios.post('/api/users/register', userData)
    history.push('/login')

  } catch (e) {
    dispatch({
      type: types.GET_ERRORS,
      payload: e.response.data
    })
  }
}

export const loginUser = (userData) => async dispatch => {
  dispatch({
    type: types.CLEAR_ERRORS
  })

  try {
    const resToken = await axios.post('/api/users/login', userData)
    console.log(resToken)
    const { token } = resToken.data
    localStorage.setItem('jwtToken', token)
    //set token to auth header
    setAuthToken(token)
    //decode token
    const decoded = jwt_decode(token)
    //set current user
    history.push('/dashboard')
    return dispatch(setCurrentUser(decoded))

  } catch (e) {
    return dispatch({
      type: types.GET_ERRORS,
      payload: e.response.data
    })
  }
}

export const setCurrentUser = (decoded) => {
  return {
    type: types.SET_CURRENT_USER,
    payload: decoded
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}