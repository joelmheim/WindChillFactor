
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { pageTitle: "Wind Chill Factor" });
};