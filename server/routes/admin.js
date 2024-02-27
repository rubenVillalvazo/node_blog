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

        res.render('admin/index', { locals, layout: adminLayout })
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
        res.render('admin/dashboard');
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