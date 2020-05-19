const router = require("express").Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

function createAccessToken(username) {
    return jwt.sign({ username }, secret, { expiresIn: '33s' })
  }
  
module.exports.check = function (req, res, next){
    const authHeader = req.headers['auth']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) {
        res.status(401).send('no token sent')
    } else {
        jwt.verify(token, accessTokenSecret, (err) => {
            if (err) {
                res.status(403).send('wrong token')
            } else {
                next()
            }
        })
    }
  }
