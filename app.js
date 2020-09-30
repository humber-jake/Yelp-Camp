const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  seedDB = require("./seeds")
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
app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});

})

// NEW
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// CREATE
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground: foundCampground});
		}
	})
});

// ==================== COMMENTS ROUTES ==================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
	
})

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})	
		}
	});
})

app.listen(3000, function(){
	console.log("The YelpCamp server has started");
})