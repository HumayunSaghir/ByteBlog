const {verifyToken} = require("../services/auth")

function checkForToken(req, res, next){
    const tokenValue = req.cookies.token

    // incase token not found just call next
    if(!tokenValue){
        return next()
    }

    // incase token is there
    try{
        const user = verifyToken(tokenValue)
        req.user = user
    }
    catch(err){}

    next()
}

// incase user is not logged in redirect to signin page
function restrictToLoggedIn(req, res, next){
    if(!req.user){
        return res.redirect("/user/signin")
    }

    next()
}


module.exports = {
    checkForToken,
    restrictToLoggedIn,
}