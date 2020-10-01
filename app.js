const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  seedDB = require("./seeds"),
	  passport = require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),

	  User = require("./models/user"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
		expressSession = require("express-session")
		
;

const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index")
;

// seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", {
	 useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// ================PASSPORT CONFIGURATION=================
app.use(expressSession({
	secret: "Please be careful what you wish for",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// ======== ROUTES ===============


app.get("/", function(req, res){
	res.render("landing");
});



// ============== AUTH ROUTES =======================

app.get("/register", function(req, res){
	res.render("register");
})

app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		})
	});
});

app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(8080, function(){
	console.log("The YelpCamp server has started");
})

