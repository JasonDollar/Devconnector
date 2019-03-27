const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

//load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

const User = require('../../models/User')
const { secretOrKey } = require('../../config/keys')

const router = express.Router()

//@route GET api/users/test
//@desc test users route
//@access public
router.get('/test', (req, res) => {
  res.json({ message: 'users' })
})

//@route POST api/users/register
//@desc register a user
//@access public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    errors.email = 'Email already exists'
    return res.status(404).json(errors)
  } 
  try {
    const avatar = gravatar.url(email, {
      s: '200', //size
      r: 'pg', //rating
      d: 'mm', //default
    })
    
    const newUser = new User({
      name,
      email,
      avatar,
    })

    const hash = await bcrypt.hash(password, 8)
    newUser.password = hash
    const createdUser = await newUser.save()
    res.json(createdUser)

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route POST api/users/login
//@desc login user / returning token
//@access public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const { email, password } = req.body

  //find user by email
  try {
    const user = await User.findOne({ email })
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      errors.password = 'Passord incorrect'
      return res.status(400).json(errors)
    }
    const payload = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
    }

    const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600 })
    res.json({
      success: true,
      token: 'Bearer ' + token,
    })


  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route GET api/users/current
//@desc return current user
//@access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  res.json({ _id: req.user._id })
})

module.exports = router 