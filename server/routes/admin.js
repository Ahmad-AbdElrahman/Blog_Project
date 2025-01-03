const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');


const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET

// 
// Check Login
const authMiddleware = (req, res, next) => {
    const token= req.cookies.token;

    if(!token) {
        return res.status(401).json( { message: 'Unauthorized' } );
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    } catch(error) {
        return res.status(401).json( { message: 'Unauthorized' } );
    }
}

// GET
// Admin - Check Login
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin Login",
            description: "Login to the admin dashboard."
        }
        res.render('admin/index', { locals, layout: adminLayout, currentRoute: '/admin' });

    } catch (error) {
        console.log(error);
    }
});

// POST
// Admin - Check Login - Handle login and generate JWT
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne( { username } );

        if(!user) {
            return res.status(401).json( { message: 'Invalid credentials' } )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json( { message: 'Invalid credentials' } )
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret )
        res.cookie('token', token, { httpOnly: true })

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET
// Admin - Dashboard - Render dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    
    try {
        const locals = {
            title: "Admin Dashboard",
            description: "Welcome to your admin dashboard."
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }

});

// GET
// Admin - Create a new post
router.get('/add-post', authMiddleware, async (req, res) => {
    
    try {
        const locals = {
            title: "Add Post",
            description: "Renders the form to create a new post."
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});

// POST
// Admin - Create a new post
router.post('/add-post', authMiddleware, async (req, res) => {
    
    try {

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            });

            await Post.create(newPost)
            res.redirect('/dashboard'); // Redirect to dashboard after successful post creation
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// GET
// Admin - Edit post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    
    try {
            const locals = {
                title: "Edit Post",
                description: "Edit your posts"
            }

            const data = await Post.findOne({ _id: req.params.id });

            res.render('admin/edit-post', {
                locals,
                data,
                layout: adminLayout
            });

    } catch (error) {
        console.log(error);
    }
});

// PUT
// Admin - Edit post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }

});

// GET
// Admin - Delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

})

// GET
// Admin - Register - Render the registration form
router.get('/register', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Register as an admin."
        }
        res.render('admin/register', { locals, layout: adminLayout, currentRoute: '/admin' });

    } catch (error) {
        console.log(error);
    }
});

// POST
// Admin - Register - Handle registration
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, firstName, lastName, bio } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({
                username,
                password: hashedPassword,
                email,
                profile: { firstName, lastName, bio }
            });
            res.status(201).redirect('/admin'); // Redirect to admin page upon successful registration
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({ message: 'User Already in use' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }

    } catch (error) {
        console.log(error);
    }
});

// GET
// Admin - Logout (clear the token)
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// GET
// Profile - Display user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const locals = {
            title: "Your Profile",
            description: "View and edit your profile."
        };

        res.render('admin/profile', { locals, user, layout: adminLayout });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET - Display edit profile page
router.get('/profile/edit', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.render('admin/edit-profile', { user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

// PUT - Update profile
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        const { email, firstName, lastName, bio } = req.body;
        const profilePicture = req.file ? req.file.path : null;

        const updateData = {
            email,
            profile: {
                firstName,
                lastName,
                bio,
                avatarUrl: profilePicture || undefined
            }
        };

        await User.findByIdAndUpdate(req.userId, updateData, { new: true });
        res.redirect('/profile'); // Redirect back to profile page after updating
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating profile');
    }
});

module.exports = router;