const express = require("express")
const bodyParser = require ("body-parser")


const app = express();
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const mongoose = require("mongoose");
const { name } = require("ejs");
mongoose.connect("mongodb://localhost:27017/todo")
const trySchema = new mongoose.Schema({
    name:String
});
const item = mongoose.model("task",trySchema);

app.get("/", async function(req, res) {
    try {
        const foundItems = await item.find({});
        res.render("list", { ejes : foundItems });
    } catch (err) {
        console.log(err);
        res.send("Error fetching items");
    }
});
app.post("/",function(req,res){
    const ItemName = req.body.ele1;
    const newItem= new item({
        name:ItemName
    });
    newItem.save();
    res.redirect("/");
})
app.post("/delete", async function (req, res) {
    const checked = req.body.checkbox1;

    try {
        await item.findByIdAndDelete(checked);
        console.log("Deleted: " + checked);
        res.redirect("/");
    } catch (err) {
        console.log("Error deleting item:", err);
        res.redirect("/");
    }
});

app.listen("3000",function(){
    console.log("server is running");
});