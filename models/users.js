const {Schema, model} = require("mongoose")
const {createHmac, randomBytes} = require("crypto")
const {createToken} = require("../services/auth")

const userSchema = new Schema({
    fullname : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
    },

    salt : {
        type : String,
    },

    password : {
        type : String,
        required : true,
    },

    profileImageUrl : {
        type : String,
        default : "/images/default.png"
    },

    role : {
        type : String,
        enum : ["USER", "ADMIN"], // only these values are allowed.
        default : "USER",
    },
 
}, {timestamps : true})

// this database middleware will run before saving a document
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // incase password not changed. this -> user

  // case when password is changed
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

// this collection method will run on collection
userSchema.static("matchPassword", async function(email, password){
    // this will refer to collection
    const user = await this.findOne({email})

    // incase user is not found
    if(!user){
        throw new Error("Invalid Credentials!")
    }

    // incase user is found
    const salt = user.salt
    const hashedPassword = user.password

    const newHashPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex")

    // incase password is matched create token and return it.
    if(hashedPassword === newHashPassword){
        const token = createToken(user)
        return token
    }

    // incase password is not matched
    throw new Error("Invalid Credentials!")
});

const userModel = new model("users", userSchema)

module.exports = userModel