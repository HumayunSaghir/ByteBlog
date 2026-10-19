const jwt = require("jsonwebtoken")
const secret = process.env.secret

// httpOnly keeps the token away from browser scripts, sameSite blocks most cross-site requests
const cookieOptions = {
    httpOnly : true,
    sameSite : "lax",
}

function createToken(user){
    const payload = {
        _id : user._id,
        name : user.fullname,
        email : user.email,
        profileImageUrl : user.profileImageUrl,
        role : user.role,
    }

    return jwt.sign(payload, secret)
}

function verifyToken(token){
    const user =  jwt.verify(token, secret)
    return user
}

module.exports = {
    createToken,
    verifyToken,
    cookieOptions,
}