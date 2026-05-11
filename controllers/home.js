const blogModel = require("../models/blogs")

async function handleShowHomepage(req, res){
    if(req.user === undefined){
        return res.status(200).render("home", {
            user : req.undefined,
            blog : undefined,
        })
    }
    const allBlogs = await blogModel.find({}) 
    return res.status(200).render("home", {
        user : req.user,
        blog : allBlogs,
    })
}

module.exports = {
    handleShowHomepage,
}