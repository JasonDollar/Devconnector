import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import {deleteExperience} from '../../store/actions'


const Experience = ({experience, deleteExperience}) => {
  const experienceJSX = experience.map(item => {
    return (
      <tr key={item._id}>
        <td>{item.company}</td>
        <td>{item.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{item.from}</Moment>{' - '}
          {item.to === null ? ('Now') : <Moment format="YYYY/MM/DD">{item.to}</Moment> } 
        </td>
        <td><button onClick={() => deleteExperience(item._id)} className="btn btn-danger">Delete</button></td>
      </tr>
    )
  })

  return (
    <div >
      <h4 className="mb-2">Experience Credentials</h4>
      <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Title</th>
          <th>Years</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          {experienceJSX}
        </tbody>
      </table>
    </div>
  )
}



export default connect(null, {deleteExperience})(Experience)

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired,
}