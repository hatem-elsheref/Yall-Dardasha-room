module.exports = (code, status, message, data = [], errors) => {
    return {
        code: code,
        status: status,
        message: message,
        data: data,
        errors: errors
    }
}