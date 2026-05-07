const {Schema, model, mongoose} = require("mongoose")

const blogSchema = new Schema({
    title : {
        type : String,
        required : true,
    },

    body : {
        type : String,
        required : true,
    },

    coverImageUrl : {
        type : String,
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }

}, {timestamps : true})

const blogModel = new model("blogs", blogSchema)

module.exports = blogModel