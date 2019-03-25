const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//db config
const db = require('./config/keys').mongoURI

// mongoose.connect(db, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// })
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('db connected'))
  .catch(e => console.log(e))


app.get('/', (req, res) => {
  res.send('works')
})

//user routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 3000
app.listen(port, () => console.log('started')) 