const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

const adminLayout = '../views/layouts/admin';

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
        console.log(req.body);

        res.render('admin/index', { layout: adminLayout })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router