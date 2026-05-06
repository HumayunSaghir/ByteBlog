const userModel = require("../models/users")

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

    return res.status(201).redirect("/")
}

function handleShowLoginPage(req, res){
    return res.status(200).render("signin")
}

async function handleLoginValidation(req, res){
    const {email, password} = req.body

    // using database static function
    const user = await userModel.matchPassword(email, password)

    // incase user is not found
    if(!user){
        throw new Error("Invalid Credentials")
    }

    // incase user found
    return res.redirect("/")
}

module.exports = {
    handleShowSignupPage,
    handleSignupFunctionality,
    handleLoginValidation, 
    handleShowLoginPage,
}