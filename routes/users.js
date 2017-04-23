const express = require('express')
const router = express.Router()
const { login,
        register,
        editInfo,
        activationAccount,
        sendResetInstruction,
        newPassword } = require('../controllers/userController')



/* POST users listing. */
router.post('/register', register)
router.post('/login', login)
router.post('/edit', editInfo)
router.post('/newPassword', newPassword)
router.post('/sendResetInstruction', sendResetInstruction)



/* GET users listing. */
router.get('/activation/:id/:token', activationAccount)



module.exports = router;