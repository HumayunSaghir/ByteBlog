const {Schema, model, mongoose} = require("mongoose")

const likeSchema = new Schema({
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "blogs",
    },

    likedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    }],

})

const likeModel = new model("likes", likeSchema)

module.exports = likeModel