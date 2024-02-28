const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/*
 **** CHECK LOGIN ****
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

/*
 **** GET/ADMIN - LOGIN PAGE ****
*/
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin page",
            description: "Here you can control de blog"
        }

        res.render('admin/index', { locals })
    } catch (error) {
        console.log(error);
    }
})

/*
 **** POST/ADMIN - LOGIN VALIDATION ****
*/
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
})

/*
 **** GET/ADMIN - DASHBOARD ****
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Admin control page',
            description: 'Posts CRUD'
        }

        let perPage = 10;
        let page = req.query.page || 1;
        page = parseInt(page);

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const hasPreviousPage = page > 1;

        res.render('admin/dashboard', {
            data,
            locals,
            layout: adminLayout,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            previousPage: hasPreviousPage ? page - 1 : null
        });
    } catch (error) {
        console.log(error);
    }
});

/*
 **** GET/ADMIN - CREATE NEW POST ****
*/
router.get('/add-posts', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Create new post',
            description: ''
        }

        const data = Post.find();

        res.render('admin/add-post', {
            data,
            locals,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }
})

/*
 **** POST/ADMIN - CREATE NEW POST ****
*/
router.post('/add-post', authMiddleware, async (req, res) => {
    try {

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            })

            await Post.create(newPost);

            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

/*
 **** GET/ADMIN - UPDATE POST ****
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

});

/*
 **** PUT/ADMIN - EDIT POST ****
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});

/*
 **** POST/ADMIN - REGISTER ****
*/
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10)

//         try {
//             const user = await User.create({ username, password: hashedPassword })
//             res.status(201).json({ message: 'User created', user })
//         } catch (error) {
//             if (error.code === 11000) {
//                 res.status(409).json({ message: 'Username already in use' });
//             }
//             res.status(500).json({ message: 'Internal server error' });

//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

module.exports = router