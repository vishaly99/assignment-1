const express = require('express')
const app = express();
const mongoose = require('mongoose');
const User = require('./model');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtkey = "jwt";

app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/db1', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected");
})

app.post('/login', (req, res) => {
    console.log(req.body);
    console.log(req.body.email);
    console.log(req.body.password);
    User.findOne({ email: req.body.email }).then((data) => {
        if (data.password == req.body.password) {
            jwt.sign({ data }, jwtkey, { expiresIn: '300s' }, (err, token) => {
                return res.status(201).json(token);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/user', verifytoken, (req, res) => {
    User.find().then((result) => {
        res.status(200).json(result);
    })
});
function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        console.warn(bearer[1]);
        req.token = bearer[1];

        jwt.verify(req.token, jwtkey, (err, authdata) => {
            if (err) {
                res.json(err);
            }
            else {
                next();
            }
        })
    }
    else {
        res.send('result token not provided');
    }
}
app.listen(8000, () => console.log('Example app listening on port !'));