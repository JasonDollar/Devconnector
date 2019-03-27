import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {logoutUser} from '../../store/actions'

const Navbar = ({logoutUser, auth}) => {
  const {isAuthenticated, user} = auth

  const onLogoutClick = (e) => {
    e.preventDefault();
    logoutUser()
  }

  const authLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <a href="#" className="nav-link" onClick={onLogoutClick}>
          <img src={user.avatar} alt={user.name} title="You must have a Gravatar connected to your email to display an image" style={{width: '25px', marginRight: '5px'}} className="rounded-circle"/>
          {' '}
          Logout
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">Sign Up</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
    </ul>
  )
  
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
    <div className="container">
      <Link className="navbar-brand" to="/">DevConnector</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profiles"> Developers
            </Link>
          </li>
        </ul>

        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </div>
  </nav>
  )
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logoutUser})(Navbar)
