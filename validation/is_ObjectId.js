const validator = require('validator')

const isObjectId = data => validator.isMongoId(data)

module.exports = isObjectId