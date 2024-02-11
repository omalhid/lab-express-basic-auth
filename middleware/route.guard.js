// Let's create a middleware to check if the user is logged in or not:
function isLoggedIn(req, res, next) {
    if (req.session.user === undefined) {
        res.redirect("/")
    } else {
        next()
    }
}

// Export it:
module.exports = {
    isLoggedIn
}
  