var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/",function(req,res){
    res.render("landing");
});


//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handel register logic
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/posts");
        });
    });
});

// show login form
router.get("/login",function(req,res){
    res.render("login");
});

//handel login logic
router.post("/login",passport.authenticate("local", //middleware
    {
        successRedirect:"/posts",
        failureRedirect: "/login"
    }), function(req,res){
        console.log("sucessssss");
});

//logout route
router.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/posts");
});

function isLoggedIn(req,res,next){   //middleware
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;