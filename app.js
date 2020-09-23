const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	let campgrounds = [
		{name: "Squamish Riverside", image: "https://www.photosforclass.com/download/px_2398220"},
		{name: "Thousand Islands, Ganonoque", image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&h=350"},
		{name: "Oka Riverside", image: "https://pixabay.com/get/53e4d1424b56a814f1dc84609620367d1c3ed9e04e507749752873d29e48c6_340.jpg"},
	]
	
	res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req, res){
	
})

app.listen(3000, function(){
	console.log("The YelpCamp server has started");
})