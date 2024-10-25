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

    // Fetch posts with pagination
    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count total documents
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
// View a specific post by ID
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        // Check if valid ObjectId before querying
        const isValidObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
        if (!isValidObjectId) {
            return res.status(404).render('404', { message: "Post not found" });
        }
    
        // Find post by ID
        const data = await Post.findById(slug);
        if (!data) {
            return res.status(404).render('404', { message: "Post not found" });
        }

        const locals = {
            title: data.title,
            description: "Describing Posts",
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.error("Error in GET /post/:id:", error);
        res.status(500).send('Server Error');
    }
});

// POST
// Search posts by term
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Searching Posts"
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
        console.error("Error in POST /search:", error);
        res.status(500).send('Server Error');
    }

});

module.exports = router;