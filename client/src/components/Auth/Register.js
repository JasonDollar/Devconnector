import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'

import {registerUser} from '../../store/actions'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  }

  

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    }
    this.props.registerUser(newUser, this.props.history)

  }


  render() {
    const {errors} = this.props
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/dashboard" />
  }
    return (
      <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>

            <form action="create-profile.html" onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  className={classNames('form-control form-control-lg',{
                    'is-invalid': errors.name
                  })} 
                  placeholder="Name" 
                  name="name" 
                  value={this.state.name} 
                  onChange={this.handleInputChange} 
                />
                {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  className={classNames('form-control form-control-lg',{
                    'is-invalid': errors.email
                  })} 
                  placeholder="Email Address" 
                  name="email" 
                  value={this.state.email} 
                  onChange={this.handleInputChange} 
                  />
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
              </div>

              <div className="form-group">
                <input 
                  type="password" 
                  className={classNames('form-control form-control-lg',{
                    'is-invalid': errors.email
                  })} 
                  placeholder="Password" 
                  name="password" 
                  value={this.state.password} 
                  onChange={this.handleInputChange} 
                />
                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
              </div>

              <div className="form-group">
                <input 
                  type="password" 
                  className={classNames('form-control form-control-lg',{
                    'is-invalid': errors.email
                  })} 
                  placeholder="Confirm Password" 
                  name="password2" 
                  value={this.state.password2} 
                  onChange={this.handleInputChange} 
                />
                {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
              </div>

              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, {registerUser})(Register)
