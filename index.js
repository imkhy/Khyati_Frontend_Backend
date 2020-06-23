var express = require("express"),
	app = express(),
	bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));




app.get('/',function(req,res){
	res.render("form.ejs");
});

app.post('/',function(req,res){
	var h=parseFloat(req.body.height);
	var c=req.body.coef;
	
	res.render("a.ejs",{h:h,c:c});
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});