const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET
// HOME
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

    } catch (error) {
        console.log(error);
    }
    res.render('admin/index', { locals });
});


module.exports = router;