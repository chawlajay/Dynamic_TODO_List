const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

var items = ["Welcome to TODO list","Enter task in box and click ADD Task"];
app.get("/",function(req,res){
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    today = today.toLocaleDateString('hi-IN',options);
    res.render('list',{day: today, listOfItems: items});
});

app.post("/", function(req,res){
    items.push(req.body.task);
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server started at port 3000");
})