const blogModel = require("../models/blogs")
const commentModel = require("../models/comments")
const likeModel = require("../models/likes")

function handleShowAddblogpage(req, res) {
    return res.status(200).render("addBlog", {
        user: req.user,
    })
}

async function handleBlogCreation(req, res) {
    const { title, body } = req.body

    const createdBlog = await blogModel.create({
        title: title,
        body: body,
        coverImageUrl: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })

    // redirect to blog show page.
    const blogId = createdBlog._id.toString()
    return res.redirect(`/blog/showBlog/${blogId}`)
}

async function handleShowBlog(req, res) {
    // fetching the blogs
    const blog = await blogModel.findById(req.params.id).populate("createdBy")
    blog.views++
    await blog.save()
    // fetching the comments
    const comments = await commentModel.find({ blogId: req.params.id }).populate("createdBy")
    // fetching the likes
    const likes = await likeModel.findOne({ blogId: req.params.id })

    return res.status(200).render("showBlog", {
        user: req.user,
        data: blog,
        commentsData: comments,
        likesData : likes,
    })
}

async function handleCommentCreation(req, res) {
    const { content } = req.body

    const createdComment = await commentModel.create({
        content: content,
        createdBy: req.user._id,
        blogId: req.params.id,
    })

    return res.redirect(`/blog/showBlog/${req.params.id}`)
}

async function handleRegisterLike(req, res) {
    // fetching the ids of user and blog
    const userId = req.user._id
    const reqId = req.params.blogId

    // search for the like document in mongodb -> findOne returns an object
    // review <--------------------------------------------------- arr and ob truthy values
    const requiredLikeDocument = await likeModel.findOne({ blogId: reqId })

    // when there is no like initially
    if (!requiredLikeDocument) {
        console.log("entered first if")
        const createdLikeDoc = await likeModel.create({
            blogId: reqId,
            // review <--------------------------------------------------- empty initialization
            likedBy: [userId],
        })
        console.log("fresh like registered!")
        return res.redirect(`/blog/showBlog/${reqId}`)
    }
    else {
        // case where there are likes
        if (requiredLikeDocument) {
            console.log("entered second if")
            // check for duplicate user like
            // review <--------------------------------------------------- canot use include for obj 
            let isLiked = requiredLikeDocument.likedBy.some((value) => {
                return value.toString() === userId.toString()
            })

            // case when post is already liked
            if (isLiked) {
                // remove a like
                const newArr = requiredLikeDocument.likedBy.filter((value) => {
                    if (value.toString() !== userId.toString()) {
                        return value
                    }
                })

                requiredLikeDocument.likedBy = newArr
                await requiredLikeDocument.save()
                // redirect
                return res.redirect(`/blog/showBlog/${reqId}`)
            }
            else {
                // case when post is not liked
                requiredLikeDocument.likedBy.push(userId)
                await requiredLikeDocument.save()

                return res.redirect(`/blog/showBlog/${reqId}`)
            }
        }
    }

}

module.exports = {
    handleShowAddblogpage,
    handleBlogCreation,
    handleShowBlog,
    handleCommentCreation,
    handleRegisterLike,
}