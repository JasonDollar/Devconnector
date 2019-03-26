const express = require('express')
const passport = require('passport')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

const validatePostInput = require('../../validation/post')

const router = express.Router()

//@route GET api/posts/test
//@desc test posts route
//@access public
router.get('/test', (req, res) => {
  res.json({ message: 'posts' })
})

//@route POST api/posts
//@desc create post
//@access private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.name,
    user: req.user._id,
  })

  try {
    const savedPost = await newPost.save()
    res.json(savedPost)
  } catch (e) {
    errors.serverErr = e.message
    res.status(500).send(errors)
  }
})

//@route GET api/posts
//@desc see all post
//@access public
router.get('/', async (req, res) => {

  try {
    const posts = await Post.find().sort({ date: -1 })
    if (!posts) {
      return res.status(404).json()
    }
    res.json(posts)
  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route GET api/posts/:post_id
//@desc see singular post
//@access public
router.get('/:post_id', async (req, res) => {

  try {
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ nopostsfound: 'Found no posts' })
    }
    res.json(post)
  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route GET api/posts/:post_id
//@desc see singular post
//@access public
router.get('/:post_id', async (req, res) => {

  try {
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ nopostfound: 'No posts found with that ID' })
    }
    res.json(post)
  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route DELETE api/posts/:post_id
//@desc delete singular post
//@access private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user._id })
    // console.log(profile)
    if (!profile) {
      return res.status(404).json({ noprofile: 'Found no profile' })
    }
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ nopostfound: 'No posts found with that ID' })
    }

    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(401).json({ notauthorized: 'User not authorized' })
    }
    await post.remove()
    res.json({ success: true })
  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route POST api/posts/like/:post_id
//@desc like a post
//@access private
router.post('/like/:post_id', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user._id })

    if (!profile) {
      return res.status(404).json({ noprofile: 'Found no profile' })
    }
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ nopostfound: 'No posts found with that ID' })
    }
    const isAlreadyLiked = post.likes
      .filter(item => item.user.toString() === req.user._id.toString()).length > 0

    if (isAlreadyLiked) {
      return res.status(400).json({ alreadyliked: 'User already liked this post' })
    }
    post.likes.push({ user: req.user._id })
    const savedPost = await post.save()
    res.json(savedPost)

  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route POST api/posts/unlike/:post_id
//@desc unlike a post
//@access private
router.post('/unlike/:post_id', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user._id })
    if (!profile) {
      return res.status(404).json({ noprofile: 'Found no profile' })
    }

    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ nopostfound: 'No posts found with that ID' })
    }

    const notLiked = post.likes
      .filter(item => item.user.toString() === req.user._id.toString()).length === 0
    
    if (notLiked) {
      return res.status(400).json({ alreadyliked: 'User did not like this post' })
    }
    
    post.likes = post.likes.filter(item => item.user === req.user._id)
    
    const savedPost = await post.save()
    res.json(savedPost)
  } catch (e) {
    res.status(500).send({ serverErr: e.message })
  }
})

//@route POST api/posts/comment/:post_id
//@desc add comment to a post 
//@access private
router.post('/comment/:id', 
  passport.authenticate('jwt', { session: false }), 
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const post = await Post.findById(req.params.id).populate('name', ['name'])
      console.log(post)
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user._id,
      }
      post.comments.push(newComment)
      // post
      const savedPost = await post.save()
      res.json(savedPost)

    } catch (e) {
      res.status(500).send({ serverErr: e.message })
    }
  })

//@route DELETE api/posts/comment/:comment_id
//@desc remove comment from a post 
//@access private
router.delete('/comment/:id/:comment_id', 
  passport.authenticate('jwt', { session: false }), 
  async (req, res) => {


    try {
      const post = await Post.findById(req.params.id)

      const filteredComments = post.comments
        .filter(item => item._id.toString() !== req.params.comment_id.toString())
        
      if (filteredComments.length === post.comments.length) {
        return res.status(404).json({ commentnotexist: 'Comment does not exist' })
      }
      
      const savedPost = await post.save()
      res.json(savedPost)

    } catch (e) {
      res.status(500).send({ serverErr: e.message })
    }
  })

module.exports = router 