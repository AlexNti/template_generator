const { HTTPErrorResponse } = require('../../Utils/responseTemplates');

module.exports = (error, req, res, next) => {
    // if error has a statusCode (API error) respond with proper message
    if (error.statusCode) {
        const response = new HTTPErrorResponse(res, '', error.message, error.statusCode);
        response.json();
    } // else it will be a 
    else {
        // handle general server error
        const response = new HTTPErrorResponse(res, 'INTERNAL_SERVER_ERROR', error.message);
        response.json();
    }
    next();
};