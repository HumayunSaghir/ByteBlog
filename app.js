require('dotenv').config()
const express = require("express")
const userRouter = require("./routes/users")
const path = require("path")
const connectDatabase = require("./connection")
const homeRouter = require("./routes/home")
const createLogs = require("./middlewares/logs")
const cookieParser = require("cookie-parser")
const {checkForToken} = require("./middlewares/auth")
const blogRouter = require("./routes/blogs")

// database connection
connectDatabase(process.env.MONGO_URL)
    .then(() => console.log("Database Connected!"))
    .catch(() => console.log("Error in Database Connection!"))

const PORT = process.env.PORT || 8000
const app = express()

// middlewares
app.use(express.urlencoded({extended : false}))
app.use(createLogs("./logs.txt"))
app.use(cookieParser())
app.use(express.static(path.resolve("./public")))


// settingup templating engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

// routers configuration
app.use("/user", userRouter)
app.use("/blog", checkForToken, blogRouter)
app.use("/", checkForToken, homeRouter)

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`))