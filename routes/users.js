const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {


  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('hi post login');
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
      const token = jwt.sign( {data: user}, config.secret, //{algorithm: 'RS256'}, //user // user.toJSON()
          { algorithm: "HS256" , expiresIn: 604800 // 1 week //{data: user}
});

        res.json({
          success: true,
         /* token: 'JWT '+token,*/
         token: token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email 
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});
 
// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
console.log('hi profile');  
  console.log(req.user);
  res.json({user: req.user});

});
module.exports = router;
