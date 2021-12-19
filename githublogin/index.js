const express = require('express')
const passport = require('passport')
const githubStrategy = require("passport-github").Strategy
const index = express()

const client_id = ""
const client_secret = ""

index.set('view engine','ejs')
passport.use(new githubStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:5000/login/success"
}, (at, rt, p, done) => {
    done(null, p, p)
}))

index.get("/login", passport.authenticate('github', {session: false}))
index.get("/login/success", passport.authenticate('github', {session: false}), (req, res) => {
    res.json("Logged in!")
})

index.listen(5000)