const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requestLogin');
const Post = mongoose.model("Post");


router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .then((posts) => {
            res.json({ message: 'Get all post successfull', data: posts });
        }).catch((err) => {
            console.log(err);
        });

});


router.post('/createpost', requireLogin, (req, res) => {
    const { title, description, pic } = req.body;
    if (!title || !description || !pic) {
        return res.status(422).json({ error: "Plase add all the fields" })
    };
    req.user.password = undefined
    const post = new Post({
        title,
        description,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ message: "Post create successfull", data: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})


module.exports = router
