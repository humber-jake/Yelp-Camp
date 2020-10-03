const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user")
;
	 
// ==============ROOT ROUTE=====================

router.get("/", function(req, res){
	res.render("landing");
});

// ============== AUTH ROUTES =======================

router.get("/register", function(req, res){
	res.render("register");
})

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", `Whoops! ${err.message}.`);
			return res.redirect("/register");
		};
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		})
	});
});

router.get("/login", function(req, res){
	res.render("login");
})

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/campgrounds");
});

module.exports = router;