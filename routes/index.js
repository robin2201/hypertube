const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')
/* GET home.js page. */

router.get('/', indexController.renderIndex)
router.get('logout', indexController.logout)
router.get('/register', indexController.register)
router.get('/signin', indexController.signin)
//router.get('/logout', logout)



module.exports = router;
