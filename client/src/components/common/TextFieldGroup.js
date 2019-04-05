import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'


const TextFieldGroup = ({
  name, 
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
    <input 
      type={type} 
      className={classNames('form-control form-control-lg',{
        'is-invalid': error
      })} 
      placeholder={placeholder}
      name={name}
      value={value} 
      onChange={onChange} 
      disabled={disabled}
    />
    {info && <small className="form-text text-muted">{info}</small> }
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
  )
}

export default TextFieldGroup

TextFieldGroup.propsTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string,
}

TextFieldGroup.defaultProps = {
  type: 'text',
  info: null,
  disabled: false
}