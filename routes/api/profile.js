const express = require('express')
// const mongoose = require('mongoose')
const passport = require('passport')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')
const isObjectId = require('../../validation/is_ObjectId')

const router = express.Router()

//@route GET api/profile/test
//@desc test profile route
//@access public
router.get('/test', (req, res) => {
  res.json({ message: 'profile' })
})

//@route GET api/profile
//@desc get current user profile
//@access private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route POST api/profile
//@desc create user profile
//@access private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)
  if (!isValid) {
    return res.json(errors)
  }

  const profileFields = {}
  profileFields.user = req.user._id
  if (req.body.handle) profileFields.handle = req.body.handle
  if (req.body.company) profileFields.company = req.body.company
  if (req.body.website) profileFields.website = req.body.website
  if (req.body.location) profileFields.location = req.body.location
  if (req.body.bio) profileFields.bio = req.body.bio
  if (req.body.status) profileFields.status = req.body.status
  if (req.body.githubusername) { profileFields.githubusername = req.body.githubusername }
  // Skills - Spilt into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',')
  }

  // Social
  profileFields.social = {}
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  try {
    const profile = await Profile.findOne({ user: req.user._id })
    //if profile found update it, else try to create new profile
    if (profile) {
      const updatedProfile = await Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true })
      return res.json(updatedProfile)
    } 

    //check if handle exists
    const profileHandle = await Profile.findOne({ handle: profileFields.handle })
    if (profileHandle) {
      errors.handle = 'That handle already exists'
      return res.status(400).json(errors)
    } 

    const newProfile = await new Profile(profileFields).save()
    res.json(newProfile)

    

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route GET api/profile/handle/:handle
//@desc get user by its handle
//@access public
router.get('/handle/:handle', async (req, res) => {
  const errors = {}
  try {
    const profile = await Profile.findOne({ handle: req.params.handle }).populate('user', ['name', 'avatar'])
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route GET api/profile/user/:user_id
//@desc get user by its id
//@access public
router.get('/user/:user_id', async (req, res) => {
  const errors = {}

  const isValidObjId = isObjectId(req.params.user_id)
  if (!isValidObjId) {
    errors.noprofile = 'Provide valid user ID'
    return res.status(400).json(errors)
  }

  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route GET api/profile/all
//@desc get all profiles
//@access public
router.get('/all', async (req, res) => {
  const errors = {}
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    if (!profiles) {
      errors.noprofile = 'There are no profiles'
      return res.status(404).json(errors)
    }
    res.json(profiles)

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route POST api/profile/experience
//@desc add experience
//@access private
router.post('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body)
  if (!isValid) {
    return res.json(errors)
  }
  
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.to ? false : req.body.current,
      description: req.body.description,
    }

    profile.experience.unshift(newExp)
    const updatedProfile = await profile.save()

    res.json(updatedProfile)

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route POST api/profile/education
//@desc add education
//@access private
router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body)
  if (!isValid) {
    return res.json(errors)
  }
  
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      // to: req.body.to,
      // current: req.body.to ? false : req.body.current,
      // description: req.body.description,
    }

    profile.education.unshift(newEdu)
    const updatedProfile = await profile.save()

    res.json(updatedProfile)

  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route DELETE api/profile/experience/:exp_id
//@desc delete experience
//@access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}
  const isValidObjId = isObjectId(req.params.exp_id)
  if (!isValidObjId) {
    errors.noprofile = 'Provide valid ID'
    return res.status(400).json(errors)
  }

  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)
    if (removeIndex < 0) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }
    profile.experience.splice(removeIndex, 1)

    const savedProfile = await profile.save()
    res.json(savedProfile)
  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route DELETE api/profile/education/:edu_id
//@desc delete experience
//@access private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {}

  const isValidObjId = isObjectId(req.params.edu_id)
  if (!isValidObjId) {
    errors.noprofile = 'Provide valid ID'
    return res.status(400).json(errors)
  }

  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
    
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id)
    if (removeIndex < 0) {
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }
    profile.education.splice(removeIndex, 1)
    console.log(removeIndex)
    // const filteredEdu = profile.education.filter(item => item.id !== req.params.edu_id)
    // profile.education = filteredEdu

    const savedProfile = await profile.save()
    res.json(savedProfile)
  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})


module.exports = router 