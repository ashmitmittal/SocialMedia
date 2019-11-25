var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");

// INDEX- show all posts of socialMedia
router.get("/",function(req,res){ //campgrounds
    //get all posts from db
    Post.find({},function(err,allposts){
        if(err){
            console.log(err);
        } else {
         res.render("posts/index",{posts: allposts});
        }
    });
});

// CREATE - add new posts to DB
router.post("/", isLoggedIn ,function(req,res){
    //get data from form and add to posts
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPosts = {name:name, image: image,description: desc,author: author};
    //create a new post and save to db
    Post.create(newPosts,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
    // posts.push(newPosts);
    //redirect
    // res.redirect("/posts");
});

//NEW - show form to create a new post
router.get("/new", isLoggedIn ,function(req,res){
    res.render("posts/new");
});

//SHOW - shows more info about one post
router.get("/:id",function(req,res){
    //find the post with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err,foundpost){
        if(err){
            console.log(err);
        } else {
            //render show template with that post
            res.render("posts/show",{post:foundpost});
        }
    });
});

// EDIT POST ROUTE
router.get("/:id/edit",checkPostOwner,function(req,res){
        Post.findById(req.params.id,function(err,foundPost){
            res.render("posts/edit",{post: foundPost});
        });
});


//UPDATE POST ROUTE
router.put("/:id",checkPostOwner,function(req,res){
    //update post
    Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatedPost){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts/"+req.params.id);
        }
    });
});

// DESTROY POST ROUTE
router.delete("/:id",checkPostOwner,function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    })
});

function isLoggedIn(req,res,next){   //middleware
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function checkPostOwner(req,res,next) //middleware
{
    if(req.isAuthenticated()){
        Post.findById(req.params.id,function(err,foundPost){
            if(err){
                res.redirect("back");
            } else {
                //does user own that post
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;