const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
require('dotenv').config({path: './config/dev.env'})

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ Error: "Please Authenticate" })
    }
}


module.exports = auth