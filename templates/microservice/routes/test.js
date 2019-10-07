const express = require('express');
const router = express.Router();
const testController = require('../controllers/test');

/**
 * @swagger
 *
 * /:
 *   get:
 *     tags:
 *       - test
 *     description: This is a test.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 */


router.get('/',testController);

module.exports = router;
