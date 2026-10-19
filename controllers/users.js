const userModel = require("../models/users")
const { createToken, cookieOptions } = require("../services/auth")

function handleShowSignupPage(req, res){
    return res.render("signup")
}

async function handleSignupFunctionality(req, res){
    const {fullname, email, password} = req.body

    // incase any field is missing
    if(!fullname || !email || !password){
        return res.status(400).render("signup", {
            message : "All fields are required!"
        })
    }

    // incase email is already registered
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(409).render("signup", {
            message : "Email already exists!"
        })
    }

    const createdUser = await userModel.create({
        fullname,
        email,
        password,
    })

    const token = createToken(createdUser)
    res.cookie("token", token, cookieOptions)

    return res.status(201).redirect("/")
}

function handleShowLoginPage(req, res){
    return res.status(200).render("signin")
}

async function handleLoginValidation(req, res){
    const {email, password} = req.body

    // using database static function
    try{
        const token = await userModel.matchPassword(email, password)
        res.cookie("token", token, cookieOptions).redirect("/")
    }

    catch(err){
        return res.render("signin", {
            message : err.message
        })
    }

}

function handleLogout(req, res){
    req.user = undefined
    res.clearCookie("token")
    return res.status(200).redirect("/")
}

module.exports = {
    handleShowSignupPage,
    handleSignupFunctionality,
    handleLoginValidation, 
    handleShowLoginPage,
    handleLogout,
}