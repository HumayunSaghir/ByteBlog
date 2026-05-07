const blogModel = require("../models/blogs")

function handleShowAddblogpage(req, res){
    return res.status(200).render("addBlog", {
        user : req.user,
    })
}

async function handleBlogCreation(req, res){
    const {title, body} = req.body
    
    const createdBlog = await blogModel.create({
        title : title,
        body : body,
        coverImageUrl : `/uploads/${req.file.filename}`,
        createdBy : req.user._id
    })

    return res.end("this will redirect to created blog page")
}


module.exports = {
    handleShowAddblogpage,
    handleBlogCreation,
}