import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'

import {loginUser} from '../../store/actions'

const Login = ({loginUser, auth, errors}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // useEffect(() => {
    
  // }, [])

  const handleFormSubmit = e => {
    e.preventDefault();
    loginUser({email, password})
    // axios.post('/api/users/login', {email, password})
    //   .then(res => console.log(res.data))
    //   .catch(err => console.error(err.response.data))
  }
  if (auth.isAuthenticated) {
      return <Redirect to="/dashboard" />
  }

  return (
    <div className="login">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your DevConnector account</p>
          <form action="dashboard.html" onSubmit={handleFormSubmit}>

            <div className="form-group">
              <input 
                type="email" 
                className={classNames('form-control form-control-lg',{
                  'is-invalid': errors.email
                })} 
                placeholder="Email Address" 
                name="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
              <input 
                type="password" 
                className={classNames('form-control form-control-lg',{
                  'is-invalid': errors.password
                })} 
                placeholder="Password" 
                name="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, {loginUser})(Login)
