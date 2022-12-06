require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const fileUpload = require('express-fileupload');
// npm init -y
// npm install ejs express express-session body-parser mongoose  connect-mongodb-session path fs bcrypt dotenv

const atlas = "mongodb+srv://dlsuBTPadmin:" + process.env.ATLAS_PASSWORD + "@dlsubtpdb.k3yt7wb.mongodb.net/dlsuBTPdb";


app.use(
    fileUpload()
);

mongoose.set('strictQuery', true);

mongoose.connect()
mongoose.connect(atlas);
const store = new mongoDBSession({
    uri: atlas,
    collection: "mySessions"
})

app.use(session({
        secret: "CCAPDEVMCO2SecretCookieSigner",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const route = require("./routes/route.js")
app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});