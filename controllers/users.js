const userModel = require("../models/users")
const { createToken } = require("../services/auth")

function handleShowSignupPage(req, res){
    return res.render("signup")
}

async function handleSignupFunctionality(req, res){
    const {fullname, email, password} = req.body

    const createdUser = await userModel.create({
        fullname,
        email,
        password,
    })

    const token = createToken(createdUser)
    res.cookie("token", token)

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
        res.cookie("token", token).redirect("/")
    }

    catch(err){
        return res.render("signin", {
            message : err.message
        })
    }

}

function handleLogout(req, res){
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