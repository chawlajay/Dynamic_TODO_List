const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var items = ["Welcome to TODO list","Enter task in box and click ADD Task"];
var workItems = ["Welcome to Work TODO list"];

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to ToDo List!"
});

const item2 = new Item({
    name: "Enter task name and hit "+" button to Add."
});

const item3 = new Item({
    name: "<-- Hit this check to delete an item."
});

const defaultItems = [item1,item2,item3];

app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(!foundItems)
        {
            Item.insertMany(defaultItems,function(err){
                if(!err)
                console.log("Successfully inserted default items in DB.");
                else
                console.log(err);
            });
        }
        res.render('list',{listTitle: "Today", listOfItems: foundItems});
    });
    
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