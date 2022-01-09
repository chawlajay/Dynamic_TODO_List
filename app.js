const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
    name: String
});

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0)
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

app.get("/list",function(req,res){
    
    List.find({},'-_id name',function(err, foundLists){
        if(!err)
        res.render("all_lists",{listNames: foundLists});
        else
        console.log(err);
    });
    
});

app.get("/list/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName},function(err, foundList){
        if(!err)
        {
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/"+customListName);
            }
            else
            res.render("list",{listTitle: customListName, listOfItems: foundList.items});
        }
    }); 
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/list", function(req,res){ 
    let itemName = req.body.newItem;
    let listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });

    if(listName === "Today")
    {
        newItem.save(function(err){
            if(err)
            console.log(err);
        });
        res.redirect("/");
    }
    else{
        List.findOne({name: listName},function(err,foundList){
            if(!err)
            {
                foundList.items.push(newItem);
                foundList.save();
            }
        });
        res.redirect("/list/"+listName);
    }
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.listItemId;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.deleteOne({_id: checkedItemId},function(err){
            if(err)
            console.log(err);
            else
            console.log("Item deleted from DB.");
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name: listName},
            {$pull: {items: {_id: checkedItemId}}},
            function(err,foundList){
                if(err)
                console.log(err);
            });
        res.redirect("/"+listName);    
    }
});

app.listen(3000,function(){
    console.log("Server started at port 3000");
})