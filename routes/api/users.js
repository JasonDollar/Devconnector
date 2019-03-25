const express = require('express')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')
const { jwtKey } = require('../../config/keys')

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
  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    return res.status(404).json({ email: 'Email already exists' })
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
    res.status(400).send({ error: e.message })
  }
})

//@route POST api/users/login
//@desc login user / returning token
//@access public
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  //find user by email
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ email: 'User not found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const payload = {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      }

      const token = jwt.sign(payload, jwtKey, { expiresIn: 3600 })
      res.json({
        success: true,
        token: 'Bearer ' + token,
      })

    } else {
      return res.status(400).json({ password: 'Password incorrect' })
    }
  } catch (e) {
    res.status(400).send()
  }
})

module.exports = router 