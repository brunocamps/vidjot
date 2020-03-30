const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express(); // initialize our application

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected...'))// promise
.catch(err => console.log(err));

// Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// How middleware works

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', {
        title: title
    });
}); //handling a get request. 

//About Route
app.get('/about', (req, res) => {
    res.render('about');

});

// Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');

});

// Process Form
app.post('/ideas', (req, res) => {
    //onsole.log(req.body);
    //res.send('ok');
    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser).save().then(idea => {
            res.redirect('/ideas')
        })
    }
    
} );




const port = 5000; // define port

app.listen(port, () =>{
    console.log('Server started on port ${port} ');
    // console.log('Server started on port ' )
}); // will listen on a certain port + callback functionnpm install body-parser