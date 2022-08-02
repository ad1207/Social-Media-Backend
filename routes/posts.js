const express = require("express")
const router = express.Router()
const Post = require('../models/posts')
const User = require('../models/user')

router.post('/', async(req,res,next) => {
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).send(savedPost)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.put('/:id',async (req,res,next) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post Updated")
        }
        else{
            res.status(403).json("You can only change your post")
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.delete('/:id', async (req,res,next) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("Post Deleted")
        }
        else{
            res.status(403).json("You can only delete your post")
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.put('/:id/like',async (req,res,next)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes:req.body.userId}})
            res.status(200).send("Liked the post")
        }else{
            await post.updateOne({$pull: {likes:req.body.userId}})
            res.status(200).send("Disliked the post")
        }

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.get('/:id', async(req,res,next) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.get('/timeline/:id',async(req,res,next) => {
    try{
        const currentUser = await User.findById(req.params.id)
        const userPosts = await Post.find({userId:currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId:friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.get("/profile/:username", async (req,res,next) =>{
    try{
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({userId:user._id})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router