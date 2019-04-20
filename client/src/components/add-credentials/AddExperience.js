import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {addExperience} from '../../store/actions'
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

class AddExperience extends Component {
  state = {
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
    errors: {},
    disabled: false
  }
  static getDerivedStateFromProps(nextProps){
    if(nextProps.errors){
      return { errors: nextProps.errors};
    }
  }
  onSubmitHandler = e => {
    e.preventDefault()
    const expData = {
      company: this.state.company,
      title: this.state.title,
      location: this.state.location,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description,
    }
    this.props.addExperience(expData)
  }
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  onCheckHandler = () => {
    this.setState(prevState => ({current: !prevState.current, disabled: !prevState.disabled}))
  }
  render() {
    const {errors} = this.state
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">Go back</Link>
              <h4 className="display-4 text-center">Add experience</h4>
              <p className="lead text-center">Add any job or position that you have had in the past or current</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmitHandler}>
                <TextFieldGroup 
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChangeHandler}
                  error={errors.company}
                />
                <TextFieldGroup 
                  placeholder="Job title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChangeHandler}
                  error={errors.title}
                />
                <TextFieldGroup 
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChangeHandler}
                  error={errors.location}
                />
                <h6>From Date</h6>
                <TextFieldGroup 
                  placeholder="From"
                  name="from"
                  type="date"
                  value={this.state.from}
                  onChange={this.onChangeHandler}
                  error={errors.from}
                />
                <h6>To date</h6>
                <TextFieldGroup 
                  placeholder="To"
                  name="to"
                  type="date"
                  value={this.state.to}
                  onChange={this.onChangeHandler}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />
                <div className="form-check mb-4">
                  <input 
                    type="checkbox"
                    className="form-check-input"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheckHandler}
                    id="current"
                  />
                  <label htmlFor="current" className="form-check-label">
                    Curent job
                  </label>
                </div>
                <TextAreaFieldGroup 
                  placeholder="Job description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChangeHandler}
                  error={errors.description}
                  info="Tell us about the position"
                />
                <input type="submit" value="Submit" className="btn btn-block btn-info mt-4"/>
                {errors && <p>{errors.serverErr}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, {addExperience})(AddExperience)

AddExperience.propsTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addExperience: PropTypes.func.isRequired 
}