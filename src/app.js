const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const dbURI = 'mongodb+srv://test123:test123@node.2on2zws.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {app.listen(3000);console.log('connected to db')})
.catch((err) => console.log(err));
app.set('view engine', 'ejs');
app.set('views', '.');

app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev'));

app.get('/add-blog', (req,res) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });
    blog.save()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/all-blogs', (req,res) => {
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/single-blog', (req,res) => {
    Blog.findById('64d96ca65f69684e3d5c5181')
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/', (req,res) => {
    res.redirect('/blogs');
});
app.get('/about', (req,res) => {
    
    res.render('about',{title: 'About'});

});


app.get('/blogs', (req,res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index',{title: 'All Blogs', blogs: result});
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/blogs', (req,res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/blogs/create', (req,res) => {
    res.render('create',{title: 'create'});
});

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        res.render('details',{title: 'Blog Details', blog: result});
    })
    .catch((err) => {
        console.log(err);
    });
});

app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: '/blogs'});
    })
    .catch((err) => {
        console.log(err);
    });
});


 
app.use((req,res) => {

    res.status(404).render('404',{title: '404'});

});


