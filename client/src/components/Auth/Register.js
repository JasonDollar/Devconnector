import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TextFieldGroup from '../common/TextFieldGroup'
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

              <TextFieldGroup 
                placeholder="Name"
                name="name"
                value={this.state.name} 
                onChange={this.handleInputChange} 
                error={errors.name}
              />

              <TextFieldGroup 
                placeholder="Email address"
                type="email" 
                name="email"
                value={this.state.email} 
                onChange={this.handleInputChange} 
                error={errors.email}
                info="This site uses Gravatar so if you want a profile image use a Gravatar email"
              />
              <TextFieldGroup 
                placeholder="Password"
                type="password" 
                name="password"
                value={this.state.password} 
                onChange={this.handleInputChange} 
                error={errors.password}
              />
              <TextFieldGroup 
                placeholder="Confirm password"
                type="password" 
                name="password2"
                value={this.state.password2} 
                onChange={this.handleInputChange} 
                error={errors.password2}
              />

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
