import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile} from '../../store/actions'

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile()
  }
  
  render() {
    return (
      <div>
        Dashboard
      </div>
    )
  }
}

export default connect(null, {getCurrentProfile})(Dashboard)

Dashboard.propsTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
}
