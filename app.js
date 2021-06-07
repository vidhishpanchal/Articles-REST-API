const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
// const ejs = require("ejs");
const app = express()

// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json())
// app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

// SCHEMA
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
// MODEL
const Article = mongoose.model("Article", articleSchema);

// -------------------REQUESTS TARGETTING ARTICLES ROUTE---------------

app.route("/articles")

.get((req, res)=> {
  Article.find((err, foundArticles)=>{
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})

.post((req, res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save()
    .then(()=>{
        res.send("Successfully added a new article")
    })
    .catch((err)=>{
        console.log(err);
    })
})

.delete((req, res)=>{
    Article.deleteMany((err)=>{
        if (!err) {
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err)
        }
    })
})
 
// -------------------REQUESTS TARGETTING SPECIFIC ROUTE---------------
app.route("/articles/:articleTitle")

.get((req, res)=>{
    // res.send(req.params);
    Article.findOne({title: req.params.articleTitle},(err, foundArticles)=>{
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send("No article matching that title was found.");
        }
        
    })
})

.put((req, res)=>{
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err)=>{
            if (!err) {
                res.send("Successfully updated article.")
            } else {
                res.send(err)
            }
        }

    )
})

.patch((req, res)=>{
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
            if (!err) {
              res.send("Successfully updated article.")  
            } else {
                res.send(err)
            }
        }
    )
})

.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
            if (!err) {
                res.send("Successfully deleted the corresponding article.")
            } else {
                res.send(err)
            }
        }
    )
})

app.listen(3000, (req, res)=>{
    console.log("Server running on port 3000.");
})