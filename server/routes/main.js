const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { get } = require('mongoose');


// GET
// HOME
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Thought Stream",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });

    } catch (error) {
        console.log(error)
    }

});

// GET
// About
router.get('/about', (req, res) => {
    res.render("about", {currentRoute: '/about'} );
});

// GET
// POST :id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
    
        const data = await Post.findById({ _id: slug });
        
        const locals = {
            title: data.title,
            description: "Simple Blog Created with Node Js. Express and MongoDB",
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
});

// POST
// POST :searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog Created with Node Js. Express and MongoDB"
        }
    let searchTerm = req.body.searchTerm
    const searchNoSpeacialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
        $or:[
            { title: { $regex: new RegExp(searchNoSpeacialChar, 'i') } },
            { body: { $regex: new RegExp(searchNoSpeacialChar, 'i') } }
        ]
    });
    res.render("search", {
        data,
        locals,
        currentRoute: '/'
    });
    } catch(error) {
        console.log(error);
    }

});

module.exports = router;