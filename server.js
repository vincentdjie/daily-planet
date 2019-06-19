const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs');//file system or local harddrive
const methodOverride = require('method-override');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); //dont use extended
app.use(layouts);
app.use(express.static('static')); //can also be public
app.use(methodOverride('_method')); ///?_method=PUT in form

//ROUTE
app.get('/', function(req, res) {
    res.send('we should add some nice landing page stuff here');
});

//get all
app.get('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    res.render('articles/index', {articleData}); //object/data that goes into render
});

//get new
app.get("/articles/new", function(req, res) {
    res.render('articles/new');
})

//get one for edit
app.get("/articles/:id/edit", function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/edit', {article: articleData[id], id});
});

//get one
app.get("/articles/:id", function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id], id});
});

//POST
app.post('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    //push new data into our array
    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(newArticle);
    //write array back into file
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));

    res.redirect('/articles');
})

//DELETE
app.delete('/articles/:id', function(req, res) {
    // Read data from file
    let articles = fs.readFileSync('./articles.json');
    // Parse data into an object
    var articleData = JSON.parse(articles);
    // Splice out the item at the specified index
    var id = parseInt(req.params.id);
    articleData.splice(id, 1);
    // Write object back to file
    fs.writeFileSync('./articles.json', JSON.stringify(articleData););
    res.redirect('/articles');
});

//PUT
app.put('/articles/:id', function(req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect("/articles/" + id);
})

//LISTEN
app.listen( PORT || 3000, function() {
    console.log('Love you ' + PORT + ' 😘');
});

