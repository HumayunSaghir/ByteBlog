const {Router} = require("express")
const {handleShowHomepage} = require("../controllers/home")

const router = Router()

router.get("/", handleShowHomepage)

module.exports = router