const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/*
 **** GET/HOME ****
*/
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog 1",
//             body: "This is the body text"
//         },
//         {
//             title: "Building a Blog 2",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 3",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 4",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 5",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 6",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 7",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 8",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 9",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 10",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 11",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 12",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 13",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 14",
//             body: "This is the body text"
//         }, {
//             title: "Building a Blog 15",
//             body: "This is the body text"
//         },
//     ]);
// }

// insertPostData();

module.exports = router