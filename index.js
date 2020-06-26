var express = require("express"),
	app = express(),
	bodyParser = require("body-parser");

const fs = require("fs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const dataPath = "./data/coordinates.json";

const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };


// To display Landing page to get input
// **********************************************************
app.get('/',function(req,res){
	res.render("form.ejs");
});

// To display Graph of given input
// To store/write the calculations to json file
// **********************************************************
app.post('/',function(req,res){
	var h=parseFloat(req.body.height);
	var c=req.body.coef;
	if (c==1){
		res.render("a.ejs",{data:dps,bounce:bounce,c:c});
	}
	else{
		var t=Math.sqrt(2*h/9.8);
		var dps = [
					{ x:0, y: h },
					{ x:t, y:0},
				];
		var flag=true;
		var i=1;
		var xVal=t,xV=0, yVal=0,count1=1,count2=1,bounce=1;
		while(flag){	
			if(i%2!=0){
				yVal = h*Math.pow(c,count1);
				xV=t*Math.pow(c, count1);
				xVal=xVal+xV;
				count1=count1+1;
				dps.push({x: xVal,y: yVal});
				if(yVal<=0.1){				
					flag=false;
					break;
				}
			}
			else
			{
				yVal = 0;
				xV=t*Math.pow(c, count2);
				xVal=xVal+xV;
				count2=count2+1;
				bounce=bounce+1;
				dps.push({x: xVal,y: yVal});
			}
			i=i+1;
		}
		var graph = {
			"dps" : dps,
			"bounces" : bounce
		}
		console.log(graph);
		readFile((data) => {
		const newGraph = Object.keys(data).length + 1;

		// add the new user
		data[newGraph] = JSON.parse(JSON.stringify(graph));

		writeFile(JSON.stringify(data, null, 2), () => {
		});
	  }, true);
		res.render("a.ejs",{data:dps,bounce:bounce,c:c});
	}
});


// To read and display the content of json file
// **********************************************************
app.get("/history", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


app.post("/hisory", (req, res) => {
  readFile((data) => {
    const newGraph = Object.keys(data).length + 1;

    // add the new user
    data[newGraph] = JSON.parse(req.body.data);

    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send("new graph added");
    });
  }, true);
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});