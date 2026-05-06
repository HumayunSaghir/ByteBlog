const fs = require("fs")

function createLogs(pathname){
    return (req, res, next) => {
        let data = `new req at ${req.path} by method ${req.method}\n`

        fs.appendFile(pathname, data, (err) => {
            if(err){
                console.log("error in database connection!")
            }
        
            next()
        })

    }
}

module.exports = createLogs