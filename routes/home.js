const multer = require("multer")
const path = require("path")
const {Router} = require("express")
const {handleShowHomepage, handleShowProfilePage, handleChangeProfileImage, handleChangeImage} = require("../controllers/home")
const {restrictToLoggedIn} = require("../middlewares/auth")

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
router.get("/user/profile", restrictToLoggedIn, handleShowProfilePage)
router.get("/user/changeProfileImage", restrictToLoggedIn, handleChangeProfileImage)
router.post("/user/changeProfileImage", restrictToLoggedIn, upload.single("profileImage"), handleChangeImage)

module.exports = router