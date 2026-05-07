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


module.exports = {
    checkForToken,
}