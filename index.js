const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const db = require("./database")
const cors = require("cors")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")
const conversationRoutes = require("./routes/conversation")
const messageRoutes = require("./routes/messages")
const multer = require("multer")
const path = require("path")

dotenv.config()
db.connect()
app.use(cors())
app.use(express.json())
app.use("/images",express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
    destination:(req,file,cb) => { 
       cb(null,'public/images') 
    },
    filename:(req,file,cb) => {
        cb(null,req.body.name)
    },
})

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req,res) => {
    
    try{
        return res.status(200).json("File uploaded successfully!")
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})



app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/conversations',conversationRoutes)
app.use('/api/message', messageRoutes)

app.listen(5000,() => {
    console.log("Server running!")
})

