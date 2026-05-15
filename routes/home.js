const multer = require("multer")
const path = require("path")
const {Router} = require("express")
const {handleShowHomepage, handleShowProfilePage, handleChangeProfileImage, handleChangeImage} = require("../controllers/home")

const router = Router()

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/profileImages/`))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage })

router.get("/", handleShowHomepage)
router.get("/user/profile", handleShowProfilePage)
router.get("/user/changeProfileImage", handleChangeProfileImage)
router.post("/user/changeProfileImage",upload.single("profileImage"), handleChangeImage)

module.exports = router