const express = require('express')
const app = express()
const cors = require("cors")
app.use(cors())

app.use('/api', require('./api/index'))
app.use(express.json())

app.listen(8080, () => {
    console.log('server started')
})