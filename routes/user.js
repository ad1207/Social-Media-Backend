const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")


router.put('/:id', async (req,res,next) => {
    if(req.body.userId === req.params.id || req.user.isAdmin ){
        if(req.body.password){
            try{
                req.body.password = await bcrypt.hash(req.body.password,10)
            }
            catch(err){
                console.log(err)
                res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            const finalUser = await User.findById(req.params.id)
            res.status(200).send(finalUser)
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        return res.status(403).send("You can only update your account")
    }
})

router.delete('/:id', async (req,res,next) => {
    if(req.body.userId === req.params.id || req.body.isAdmin ){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Successfully deleted")
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        return res.status(403).send("You can only delete your account")
    }
})

router.get('/',async (req,res,next) => {
    const userId = req.query.userId
    const username = req.query.username
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username:username})
        const {createdAt,updatedAt,password,...others} = user._doc
        res.status(200).send(others)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }    
})

router.get("/friends/:userId",async(req,res) => {
    try{
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all(
            user.following.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = []
        friends.map((friend) => {
            const {_id,username,profilePicture} = friend;
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.put('/:id/follow', async (req,res,next) => {
    if(req.body.userId!==req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("Followed user")
            }
            else{
                res.status(400).send("Already following the user")
            }
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        res.status(400).json("Can't follow yourself")
    }
})

router.put('/:id/unfollow', async (req,res,next) => {
    if(req.body.userId!==req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("Unfollowed user")
            }
            else{
                res.status(400).send("Not following the user")
            }
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
    }else{
        res.status(400).json("Can't unfollow yourself")
    }
})

router.get('/',(req,res,next) => {
    res.send("This is user route")
})

module.exports = router