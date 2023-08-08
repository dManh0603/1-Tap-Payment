const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authenticate = async (req, res, next) => {
    try {
        let encodedToken;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            encodedToken = req.headers.authorization.split(' ')[1]
            if (!encodedToken) {
                res.status(401)
                throw new Error('Invalid token');
            }

            const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.id).select('-password').exec();
            if (!user) {
                res.status(404);
                throw new Error('No match token');
            }
            req.user = user;
            next()
        } else {
            res.status(400)
            throw new Error('Missing token')
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = authenticate