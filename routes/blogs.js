const {Router} = require("express")
const {handleShowAddblogpage, handleBlogCreation} = require("../controllers/blogs")
const multer = require("multer")
const path = require("path")

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

module.exports = router