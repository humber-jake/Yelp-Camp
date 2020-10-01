const { findByIdAndUpdate } = require("../models/campground.js");

const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground.js")
;

// INDEX
router.get("/", function(req, res){
	req.user
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});

})

// NEW
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// CREATE
router.post("/", isLoggedIn, function(req, res){
	let name = req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, newCamp){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});	
})

// SHOW
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground: foundCampground});
		}
	})
});

// EDIT
router.get("/:id/edit", checkOwnershipCampground, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
					res.render("campgrounds/edit", {campground: foundCampground});
		});
});

// UPDATE
router.put("/:id", checkOwnershipCampground, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
		res.redirect("/campgrounds");
		}	else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// DESTROY
router.delete("/:id", checkOwnershipCampground, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


function checkOwnershipCampground(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					res.redirect("back");
				} else {
					if(foundCampground.author.id.equals(req.user.id)){
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