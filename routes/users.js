const {Router} = require("express")
const {handleShowSignupPage, handleSignupFunctionality, handleLoginValidation, handleShowLoginPage} = require("../controllers/users")

const router = Router()

router.get("/signup", handleShowSignupPage)
router.post("/signup", handleSignupFunctionality)
router.get("/signin", handleShowLoginPage)
router.post("/signin", handleLoginValidation)


module.exports = router