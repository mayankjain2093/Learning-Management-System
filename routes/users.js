const express = require('express')
const router = express.Router({mergeParams: true})
const User = require('../models/user')

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    // res.send(req.body)
    try{
    const { email, username, password } = req.body
    const user = new User({email, username})
    const registerUser = await User.register(user,password)
    req.flash('success', 'Welcome to LMS!')
    res.redirect('/courses')
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

module.exports = router