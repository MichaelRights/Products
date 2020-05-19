const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.use(express.json())

router.post("/", async (req, res) => {
    console.log(req.body)
    let { username, password } = req.body;
    await bcrypt
        .hash(password, 10)
        .then(async (hashedPassword) => {
            const filePath = path.resolve('data/users.json')
            fs.readFile(filePath, 'utf8', (error, data) => {
                if (error) {
                    res.status(404).send(error)
                    console.log(error)
                }
                else {
                    obj = JSON.parse(data)
                    obj.users.push({ username, hashedPassword })
                    json = JSON.stringify(obj)
                    fs.writeFile(filePath, json, 'utf8', () => {
                        let token = createAccessToken(username)
                        res.status(200).send({ token })
                    })
                }
            })
        })
        .catch((error) => {
            res.status(500).send(error)
        })
})

function createAccessToken(username) {
    return jwt.sign({ username }, accessTokenSecret, { expiresIn: '20s' })
}

module.exports = router