import axios from 'axios'
// import jwt_decode from 'jwt-decode'
import history from '../../history'
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

export const createProfile = (profileData) => dispatch => {
  axios.post('/api/profile', profileData)
    .then(result => history.push('/dashboard'))
    .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
}

export const addExperience = (expData) => dispatch => {
  axios.post('/api/profile/experience', expData)
    .then(res => {
      history.push('/dashboard')
    })
    .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
}

export const addEducation = (eduData) => dispatch => {
  axios.post('/api/profile/education', eduData)
    .then(res => {
      history.push('/dashboard')
    })
    .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
}

export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can be undone')) {
    axios.delete('/api/profile')
      .then(res => dispatch({type: types.SET_CURRENT_USER, payload: {}}))
      .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
  }
}

export const deleteExperience = (id) => dispatch => {
  axios.delete('/api/profile/experience/' + id)
    .then(res => dispatch({
      type: types.GET_PROFILE,
      payload: res.data,
    }))
    .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
}
export const deleteEducation = (id) => dispatch => {
  axios.delete('/api/profile/education/' + id)
    .then(res => dispatch({
      type: types.GET_PROFILE,
      payload: res.data,
    }))
    .catch(err => dispatch({type: types.GET_ERRORS, payload: err.response.data}))
}