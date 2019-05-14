var config = require('../config/app');
var express = require('express');
var app = express();
var port = process.env.PORT || config.SERVER.PORT;
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');

// passport js integartion
var passport = require('passport');
const passportJWT = require('passport-jwt');
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
let ExtractJwt = passportJWT.ExtractJwt;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';


// ========================================== CONTROLLERS V1==========================================

var userRouter = require('../routes/users');

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({
        id: jwt_payload.id
    });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// use the strategy
passport.use(strategy);
app.use(passport.initialize());


app.listen(port, () => console.log("Listening to port " + port + ".."));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(multipart({
    uploadDir: config.tmp
}));


//========================================== ROUTES V1==========================================

app.use(config.SERVER.API_PATH + '/users', userRouter);