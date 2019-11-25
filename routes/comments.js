var express = require("express");
var router  = express.Router({mergeParams:true});
var Post = require("../models/post");
var Comment = require("../models/comment");

//comments new
router.get("/new",isLoggedIn,function(req, res){
    //find post by id
    Post.findById(req.params.id,function(err,post){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{post:post});
        }
    });
});

//comments create
router.post("/",isLoggedIn,function(req,res){
    //lookup posts usign id
    Post.findById(req.params.id,function(err,post){
        if(err){
            console.log(err);
            res.redirect("/posts");
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // then save comment
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/posts/"+post._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to post
    //redirect post show page
});

function isLoggedIn(req,res,next){   //middleware
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;