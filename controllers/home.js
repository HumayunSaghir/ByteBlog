const blogModel = require("../models/blogs")
const userModel = require("../models/users")
const {createToken} = require("../services/auth")

async function handleShowHomepage(req, res){
    if(req.user === undefined){
        return res.status(200).render("home", {
            user : undefined,
            blog : undefined,
        })
    }
    const allBlogs = await blogModel.find({}) 
    return res.status(200).render("home", {
        user : req.user,
        blog : allBlogs,
    })
}

async function handleShowProfilePage(req, res){
    const yourBlogs = await blogModel.find({createdBy : req.user._id})
    return res.status(200).render("profilePage", {
        user : req.user,
        name : req.user.name,
        email : req.user.email,
        profileImageUrl : req.user.profileImageUrl,
        allBlogs : yourBlogs
    })
}

async function handleChangeProfileImage(req, res){
    return res.status(200).render("changeProfileImage", {
        user : req.user
    })
}

async function handleChangeImage(req, res){
    const reqUser = await userModel.findById(req.user._id)

    reqUser.profileImageUrl = `/profileImages/${req.file.filename}`
    await reqUser.save()

    req.user.profileImageUrl = reqUser.profileImageUrl

    // we need to clear and update the token
    res.clearCookie("token")
    const token = createToken(reqUser)
    res.cookie("token", token)

    return res.status(200).redirect('/user/profile')
}

module.exports = {
    handleShowHomepage,
    handleShowProfilePage,
    handleChangeProfileImage,
    handleChangeImage,
}