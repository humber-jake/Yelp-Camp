const Campground = require("../models/campground.js"),
      Comment = require("../models/comment.js")
;

const middlewareObj= {};

middlewareObj.checkOwnershipCampground = function checkOwnershipCampground(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", "Whoops, something went wrong.");
					res.redirect("back");
				} else {
					if(foundCampground.author.id.equals(req.user.id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged in to do that.");
			res.redirect("back");
			}
}


middlewareObj.checkOwnershipComment = function checkOwnershipComment(req, res, next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				} else {
					if(foundComment.author.id.equals(req.user.id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("back");
			}
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please log in to do that.");
	res.redirect("/login");
}




module.exports = middlewareObj;