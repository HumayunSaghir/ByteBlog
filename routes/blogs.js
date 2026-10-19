const {Router} = require("express")
const multer = require("multer")
const path = require("path")
const {handleShowAddblogpage, handleBlogCreation, handleShowBlog,
  handleCommentCreation, handleRegisterLike,
} = require("../controllers/blogs")
const {restrictToLoggedIn} = require("../middlewares/auth")

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage })

const router = Router()

// functionality for comments
router.get("/addBlog", restrictToLoggedIn, handleShowAddblogpage)
router.post("/addBlog", restrictToLoggedIn, upload.single("coverImage") ,handleBlogCreation)
router.get("/showBlog/:id", restrictToLoggedIn, handleShowBlog)
router.post("/addComment/:id", restrictToLoggedIn, handleCommentCreation)

// functionality for likes    :blogId === showBlog/:id
router.get("/like/:blogId", restrictToLoggedIn, handleRegisterLike)

module.exports = router