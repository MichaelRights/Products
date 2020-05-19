const router = require('express').Router()
const products = require('../data/products.json').products

router.get('/', (req, res) => {
    res.status(200).send(products)
})

module.exports = router