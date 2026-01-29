const express = require('express')
const router = express.Router({ mergeParams: true })
const passport = require('passport')
const User = require('../models/user')

const { storeReturnTo } = require('../middleware')

const userControllers = require('../controllers/users')

router.get('/register', userControllers.renderRegisterForm)

router.post('/register', userControllers.register)

router.get('/login', userControllers.renderLoginForm)

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    userControllers.login);

router.get('/logout', userControllers.logout)

module.exports = router