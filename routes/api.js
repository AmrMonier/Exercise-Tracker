const express = require('express')
const User = require('../models/User')
const Exercise = require('../models/Exercise')
const router = express.Router()
router.post('/exercise/new-user', (req, res, next) => {

    User.find({ username: req.body.username }).count((err, exist) => {
        if (exist) {
            res.statusCode = 422
            res.json({ error: 'username already taken' })
        }
        else
            User.create({ username: req.body.username }, (err, data) => {
                err ? console.log(err) : res.json(data)
            })
    })
});

router.get('/exercise/users', (req, res, next) => {
    User.find({}, (err, users) => {
        res.json(users)
    })

})

router.post('/exercise/add', (req, res, next) => {
    User.findById(req.body.userId, (err, user) => {
        err ? res.json({ error: 'invalid username' })
            : Exercise.create({
                username: user.username,
                description: req.body.desc,
                duration: req.body.mins,
                date: (req.body.date)
            }, (err, exercise) => {
                err ? res.json(err) : res.json(exercise)
            })
    })
})

router.get('/exercise/log', (req, res, next) => {
    // res.json(req.query)
    User.findById(req.query.userId, (err, user) => {
        if (err) {
            console.log(err)
            res.statusCode = 500
            res.json({ error: 'Server Error' })
        } else {
            if (user) {
                let query = Exercise.find({ username: user.username })

                if (req.query.from) {
                    query = query.where('date').gte(req.query.from)
                }
                if (req.query.to) {
                    query = query.where('date').lte(req.query.to)
                }
                if (req.query.limit)
                    query = query.limit(parseInt(req.query.limit))
                query.exec((err, data) => {
                    user = user.toObject()
                    user.exercises = data
                    err ? console.log(err) : res.json(user)
                })
            } else {
                res.statusCode = 404
                // res.json({ err   or: user })
                res.json({ error: 'Invalid user id' })
            }
        }
        // Exercise.find()
    })
})
module.exports = router