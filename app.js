require('dotenv').config()
const express = require("express")
const userRouter = require("./routes/users")
const path = require("path")
const connectDatabase = require("./connection")
const homeRouter = require("./routes/home")
const createLogs = require("./middlewares/logs")

// database connection
connectDatabase(process.env.MONGO_URL)
    .then(() => console.log("Database Connected!"))
    .catch(() => console.log("Error in Database Connection!"))

const PORT = 8000
const app = express()

// middlewares
app.use(express.urlencoded({extended : false}))
app.use(createLogs("./logs.txt"))


// settingup templating engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

// routers configuration
app.use("/user", userRouter)
app.use("/", homeRouter)

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`))