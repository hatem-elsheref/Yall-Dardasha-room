const { validationResult } = require('express-validator')

const Response = require('./response')

module.exports.checkValidationError = (request, response, next) => {

    let errors = validationResult(request)

    var extractedErrors = {}
    var Errors = []
    errors.array().map(function (err) {

        Errors.push(err.msg)
        try {
            extractedErrors[err.param].push(err.msg)
        } catch (Error) {
            extractedErrors[err.param] = []
            extractedErrors[err.param].push(err.msg)
        }
    })

    if (!errors.isEmpty()) {
        return response.status(422).send({code: 422, status: 'fail', message: 'validation error', errors: Errors})
    }

    next()
}