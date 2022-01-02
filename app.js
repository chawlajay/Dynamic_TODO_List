const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var items = ["Welcome to TODO list","Enter task in box and click ADD Task"];
var workItems = ["Welcome to Work TODO list"];
app.get("/",function(req,res){
    // var today = new Date();

    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric"
    // };
    // today = today.toLocaleDateString('hi-IN',options);
    res.render('list',{listTitle: "Today", listOfItems: items});
});

app.get("/work",function(req,res){
    res.render('list',{listTitle: "Work", listOfItems: workItems});
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/", function(req,res){
    
    let item = req.body.task;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

app.listen(3000,function(){
    console.log("Server started at port 3000");
})