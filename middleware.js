// This module checks if a user is authenticated , if it is not, then it stores a returnTo variable in sessions. Then it flashes
//  an error messages and redirects user to a login page
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next()
}

// Before logging a user, this middleware checks if session has storeReturnTo. If it has, it stores this information to a 
// locals variable. This allows us to persist information in a session even if passport.authenticate destroys any session 
// information
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}