import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'


const PrivateRoute = ({component: Component, auth, ...rest}) => {
  return (
    <Route 
      {...rest}
      render={props => {
        if (auth.isAuthenticated) {
          return <Component {...props} /> 
        }
        return <Redirect to="/login" />
      }} 
    />
    
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
}