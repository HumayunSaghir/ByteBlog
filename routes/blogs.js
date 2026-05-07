const {Router} = require("express")
const multer = require("multer")
const path = require("path")
const {handleShowAddblogpage, handleBlogCreation, handleShowBlog,
  handleCommentCreation,
} = require("../controllers/blogs")

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

router.get("/addBlog", handleShowAddblogpage)
router.post("/addBlog", upload.single("coverImage") ,handleBlogCreation)
router.get("/showBlog/:id", handleShowBlog)
router.post("/addComment/:id", handleCommentCreation)

module.exports = router