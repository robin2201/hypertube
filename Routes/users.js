const express = require('express')
const router = express.Router()
const { login,
        register,
        editInfo,
        activationAccount,
        sendResetInstruction,
        newPassword,
        registerWith42 } = require('../Controllers/userController')
//const { home } = require('../controllers/indexController')



/* POST users listing. */
router.post('/register', register)
router.post('/login', login)
router.post('/edit', editInfo)
router.post('/newPassword', newPassword)
router.post('/sendResetInstruction', sendResetInstruction)


/* GET users listing. */
router.get('/activation/:id/:token', activationAccount)
router.get('/oauth/42', registerWith42)

//router.get('/edit', home)


module.exports = router;