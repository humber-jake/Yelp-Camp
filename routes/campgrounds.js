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
router.get("/new", function(req, res){
	res.render("campgrounds/new");
});

// CREATE
router.post("/", function(req, res){
	let name = req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let newCampground = {name: name, image: image, description: description};
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

module.exports = router;