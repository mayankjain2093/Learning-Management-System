const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res,next) => {
    // res.send(req.body)
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        // If a new user it registerd , following code automatically logs it in. So we donot have to logged in the same new 
        // registered user.
        req.login(registerUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to LMS!')
            res.redirect('/courses')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/courses'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    }

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/courses');
    })
}