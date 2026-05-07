const jwt = require("jsonwebtoken")
const secret = process.env.secret

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
}