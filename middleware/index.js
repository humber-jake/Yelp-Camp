const Campground = require("../models/campground.js"),
      Comment = require("../models/comment.js")
;

const middlewareObj= {};

middlewareObj.checkOwnershipCampground = function checkOwnershipCampground(req, res, next){
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


middlewareObj.checkOwnershipComment = function checkOwnershipComment(req, res, next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				} else {
					if(foundComment.author.id.equals(req.user.id)){
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

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}




module.exports = middlewareObj;