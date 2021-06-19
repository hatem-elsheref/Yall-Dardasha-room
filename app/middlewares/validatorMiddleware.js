const { body} = require('express-validator')
const {devEnvironment} = require('../config')
const fetch = require('node-fetch')
module.exports.verifyToken = async (request, response, next) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': request.headers.authorization
        }
    }

    let api = '/verify-redis'
    let authResponse = null

    if (devEnvironment){
        authResponse = await fetch( 'http://localhost:3000' + api, options).then(res => res.json())
    }else{
        authResponse = await fetch('https://yalla-dardasha-otp.herokuapp.com' + api, options).then(res => res.json())
    }

    if (authResponse.status === true){
        request.body.user_id = authResponse.user
        return next();
    }

    return response.status(403).json({code: 403, message: "un authorized"});

}
module.exports.roomValidator = () => {
    return [
        body('name','name is required').isLength({min : 4})
    ]
}
