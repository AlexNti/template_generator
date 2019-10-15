const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

const router = express.Router();

router.use('/swagger', swaggerUi.serve);
router.get('/swagger', swaggerUi.setup(swaggerDocument));


module.exports = router;