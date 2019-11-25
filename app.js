var port = process.env.PORT || 3000;

const express           = require("express"),
      app               = express(),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      methodOverride    = require("method-override"),
      Post              = require("./models/post"),
      Comment           = require("./models/comment"),
      User              = require("./models/user"),
      seedDB            = require("./seeds");

//require routes
var commentRoutes = require("./routes/comments"),
    postsRoutes   = require("./routes/posts"),
    authRoutes    = require("./routes/index");

// mongoose.connect('mongodb://localhost/social', {useUnifiedTopology: true, useNewUrlParser: true});
 mongoose.connect("mongodb+srv://ashi:tomjarry@social-arex2.mongodb.net/test?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true});
// mongodb+srv://ashi:tomjarry@social-arex2.mongodb.net/test?retryWrites=true&w=majority

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine","ejs");

//all posts will remove form this
// seedDB(); // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"i am losser",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){ //middleware that run for every single route
    res.locals.currentUser = req.user;
    next();
});


app.use(authRoutes);
app.use("/posts",postsRoutes);
app.use("/posts/:id/comments",commentRoutes);


app.listen(port,function(){
    console.log("Social app started at port 3000!");
});