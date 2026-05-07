const {Router} = require("express")
const {handleShowSignupPage, handleSignupFunctionality, handleLoginValidation,
    handleShowLoginPage, handleLogout} = require("../controllers/users")

const router = Router()

router.get("/signup", handleShowSignupPage)
router.post("/signup", handleSignupFunctionality)
router.get("/signin", handleShowLoginPage)
router.post("/signin", handleLoginValidation)
router.get("/logout", handleLogout)

module.exports = router