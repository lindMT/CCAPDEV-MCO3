const { redirect } = require('statuses');
const User = require('../model/usersSchema.js');
const Post = require('../model/postSchema.js');
const path = require('path');
const bcrypt = require("bcrypt");

const profilecontroller = {
    getProfile: function(req, res) {

        if(req.session.isAuth) {
            User.findOne({ userName: req.params.clickedUserName }, function (err, userdocs) {
                if (err){
                    console.log(err);
                }
                else{
                    Post.find({ postedBy: req.params.clickedUserName }, function (err, postdocs) {
                        if (err){
                            console.log(err);
                        }
                        else{
                            console.log("Profile selected.")
                            res.render('profile', {user: userdocs, posts: postdocs})
                        }
                    });
                }
            });
        }
        else {
            res.render('login', {loginPrompt: "Please Login First"});
        }

    },

    getProfileEdit: function(req, res) {

        if(req.session.isAuth) {
            User.findOne({ userName: req.session.userName }, function (err, docs) {
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Profile edit selected.")
                    res.render('profileedit', {user: docs, imagePrompt: ""})
                }
            });
            
        }
        else {
            res.render('login', {loginPrompt: "Please Login First"});
        }

    },

    saveProfileEdit: function(req, res) {

        if(req.session.isAuth) {

            const fname = req.body.fname;
            const lname = req.body.lname;
            const bio = req.body.bio;
            const email = req.body.email;
            
            if (!req.files){
                User.updateOne({ userName: {$eq: req.session.userName} }, 
                    { 
                        firstName: fname,
                        lastName: lname,
                        bio: bio,
                        email: email
                    }
                    , null, function (err, docs) {
                    if (err){
                        User.findOne({ userName: req.session.userName }, function (err2, docs2) {
                            if (err2){
                                console.log(err2);
                            }
                            else{
                                console.log("Profile edit selected.")
                                res.render('profileedit', {user: docs2, imagePrompt: "The email you've inputted has already been taken."})
                            }
                        });
                    }
                    else{
                        res.redirect("/profile/" + req.session.userName);
                    }
                });
            } else {

                const profileImg = req.files.profileImg;
                const userName = req.session.userName;
                var extension = profileImg.name.split('.').pop().toUpperCase(); 
                if (extension!="PNG" && extension!="JPG" && extension!="JPEG" && extension!="JFIF"){
                    res.render('profileedit',  {imagePrompt: "Invalid file type! Please choose an image."});
                }
            
                profileImg.mv(path.resolve('public/images/dp',userName+"_dp."+extension),function(err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Successful profile image upload!");
                    }
                });
                
                const imgPath = '/images/dp/'+userName+"_dp"+"."+extension;

                User.updateOne({ userName: {$eq: req.session.userName} }, 
                    { 
                        profileImg: imgPath,
                        firstName: fname,
                        lastName: lname,
                        bio: bio,
                        email: email
                    }
                    , null, function (err, docs) {
                    if (err){
                        User.findOne({ userName: req.session.userName }, function (err2, docs2) {
                            if (err2){
                                console.log(err2);
                            }
                            else{
                                console.log("Profile edit selected.")
                                res.render('profileedit', {user: docs2, imagePrompt: "The email you've inputted has already been taken."})
                            }
                        });
                    }
                    else{
                        req.session.dp = imgPath;
                        res.redirect("/profile/" + req.session.userName);
                    }
                });
            }
        } else {
            res.render('login', {loginPrompt: "Please Login First"});
        }
    }, 

    resetpassword: function(req, res) {

        if(req.session.isAuth) {
            res.render('resetpassword', {resetPrompt: ""});
        } else {
            res.render('login', {loginPrompt: "Please Login First"});
        }
    },

    saveresetpassword: function(req, res) {

        if(req.session.isAuth) {
            const pw1 = req.body.pw1;
            const pw2 = req.body.pw2;

            console.log("The input for password 1 is: " + pw1)
            console.log("The input for password 2 is: " + pw2)
            if (pw1 != pw2){
                res.render('resetpassword', {resetPrompt: "Please match the passwords."});
            } else{

                var hashedpw = bcrypt.hashSync(pw1, 10);
                User.updateOne({ userName: {$eq: req.session.userName} }, 
                    { 
                        password: hashedpw
                    }
                    , null, function (err, docs) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.render('resetpassword', {resetPrompt: "Password changed successfully."});
                    }
                });
            }
            
        } else {
            res.render('login', {loginPrompt: "Please Login First"});
        }
    },
     
}

module.exports = profilecontroller;