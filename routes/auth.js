const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")



router.post('/register',async (req,res,next) => {
    try{
        const encryptedPassword = await bcrypt.hash(req.body.password,10)
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:encryptedPassword
        })
        const user = await newUser.save()
        res.status(200).send(user)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.post('/login',async (req,res,next) =>{
    try{
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("User not found")

        const correctPassword = await bcrypt.compare(req.body.password,user.password)
        !correctPassword && res.status(400).json("Incorrect password")

        res.status(200).send(user)
    }catch(err){
        res.status(500).json(err)
    }
})


router.get('/',(req,res,next) => {
    res.send("This is auth route")
})

module.exports = router