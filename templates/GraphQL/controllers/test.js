const { HTTPErrorResponse } = require('../Utils/responseTemplates');
const logger = require('../Utils/logger');

module.exports = (req, res, next) => {
  if (req.body.first_player_id === req.body.second_player_id) {
    logger.error('Error:', "You cant play with your self");
    next(new HTTPErrorResponse(res,'404','You cant play with your self',404))
  }
};
