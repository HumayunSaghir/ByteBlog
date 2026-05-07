const {Schema, model, mongoose} = require("mongoose")

const commentsSchema = new Schema({
    content : {
        type : String,
        required : true,
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "blogs",
    },

}, {timestamps : true})

const commentModel = new model("comments", commentsSchema)

module.exports = commentModel