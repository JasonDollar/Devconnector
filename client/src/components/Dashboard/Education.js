import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import {deleteEducation} from '../../store/actions'


const Education = ({education, deleteEducation}) => {
  const educationJSX = education.map(item => {
    return (
      <tr key={item._id}>
        <td>{item.school}</td>
        <td>{item.degree}</td>
        <td>
          <Moment format="YYYY/MM/DD">{item.from}</Moment>{' - '}

          {item.to === null ? ('Now') : <Moment format="YYYY/MM/DD">{item.to}</Moment> } 
          

        </td>
        <td><button onClick={() => deleteEducation(item._id)} className="btn btn-danger">Delete</button></td>
      </tr>
    )
  }) 

  return (
    <div >
      <h4 className="mb-2">Education Credentials</h4>
      <table className="table">
      <thead>
        <tr>
          <th>School</th>
          <th>Degree</th>
          <th>Years</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          {educationJSX}
        </tbody>
      </table>
    </div>
  )
}



export default connect(null, {deleteEducation})(Education)

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
}