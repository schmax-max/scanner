const fs = require('fs')

exports.body = JSON.parse(fs.readFileSync(`./tests/data/body.json`, 'UTF-8'))
exports.body1 = JSON.parse(fs.readFileSync(`./tests/data/body1.json`, 'UTF-8'))
exports.body2 = JSON.parse(fs.readFileSync(`./tests/data/body2.json`, 'UTF-8'))
