const blogModel = require("../models/blogs")
const commentModel = require("../models/comments")

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

    // redirect to blog show page.
    const blogId = createdBlog._id.toString()
    console.log(blogId)
    return res.redirect(`/blog/showBlog/${blogId}`)
}

async function handleShowBlog(req, res){
    // fetching the blogs
    const blog = await blogModel.findById(req.params.id).populate("createdBy")
    blog.views++
    await blog.save()
    // fetching the comments
    const comments = await commentModel.find({blogId : req.params.id}).populate("createdBy")
    return res.status(200).render("showBlog", {
        user : req.user,
        data : blog,
        commentsData : comments,
    })
}

async function handleCommentCreation(req, res){
    const {content} = req.body

    const createdComment = await commentModel.create({
        content : content,
        createdBy : req.user._id,
        blogId : req.params.id,
    })

    return res.redirect(`/blog/showBlog/${req.params.id}`)
}


module.exports = {
    handleShowAddblogpage,
    handleBlogCreation,
    handleShowBlog,
    handleCommentCreation,
}