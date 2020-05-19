const express = require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const router = express.Router()

router.use(express.urlencoded({ extended: false }))
router.use(express.json())
router.use(express.static(path.resolve('public')))



router.post('/', async (req, res) => {

    const { username, password } = req.body
    const filePath = path.resolve('data/users.json')
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            res.status(404).send(error)
            console.log(error)
        }
        else {
            let hashedPassword
            let obj = JSON.parse(data)
            if (!obj.users.find(user => {
                if (user.username === username) {
                    hashedPassword = user.hashedPassword
                    return true
                }
            })) {
                res.send(404).send("wrong username")
            }
            else {
                bcrypt.compare(password, hashedPassword)
                    .then(authBool => {
                        if (authBool) {
                            let token = createAccessToken(username)
                            res.status(200).send({ token })
                        } else {
                            console.log('wrong password')
                            res.status(403).send('wrong password')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send(err)
                    })
            }
        }

    })
})

function createAccessToken(username) {
    return jwt.sign({ username }, accessTokenSecret, { expiresIn: '20s' })
}

module.exports = router