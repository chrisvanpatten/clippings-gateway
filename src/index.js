var request = require('request-promise')
var config = require('../config.json')
var fs = require('fs')
var path = require('path')
var uuid = require('uuid/v4')

var request = request.defaults({
  jar: true
})

// Grab the login form
request.post({
  url: 'https://api.clippings.io/api/login',
  body: {
    "username": config.username,
    "password": config.password
  },
  json: true,
}).then(function (response) {

  // Get info about the My Clippings file
  var file = fs.createReadStream(config.filePath)
  var stat = fs.statSync(config.filePath)

  // Build the form data to be submitted
  var formData = {
    qquuid: uuid(),
    qqtotalfilesize: stat.size,
    qqfilename: path.basename(config.filePath),
    qqfile: file,
  }

  // Upload the file
  return request.post({
    url: 'https://api.clippings.io/api/UserFileUploads/',
    json: true,
    headers: {
      'Authorization': response.token
    },
    formData: formData,
  })
}).then(function (result) {
  // Exit successfully
  console.log(result)
  console.log('Success!')
  process.exit()
}).catch(function(error) {
  // Exit with an error
  console.error(error.response.errors[0].message)
  process.exit(1)
})
