const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('../../passport')




router.post('/signup', (req, res) => {
    console.log('user signup x');
console.log(req.body)
    const { firstName, lastName, username, password } = req.body
   
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        console.log("USER:" + user);
        
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user !=null) {
            res.json({
                error: `Sorry, already a user with the email: ${username}`
            })
        }
        else {
            const newUser = new User({
                firstName: firstName,
                lastName : lastName,
                username: username,
                password: password
            });
            console.log("saving ")
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/login',
    function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        
        res.json(req.user);
    }
)







router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        console.log("logging out")
        req.logout()
        res.send({ msg: 'logging out' })
       
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router
