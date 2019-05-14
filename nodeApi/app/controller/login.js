const validator = require('../lib/validator');
const models = require('../models');
const msg91 = require('../lib/msg91');
const Config = require('../config/app');


//passport js data
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

module.exports = {

    login: function (req, res) {

        (async () => {
            try {
                await validator.validate(req.body, [
                    "login_type"
                ]);
                var userData = await login(req.body);
                // let token = jwt.sign(payload, jwtOptions.secretOrKey);
                return res.status(200).send({
                    status: 1,
                    message: "success",
                    token: userData.token,
                    data: {
                        id: userData.id,
                        first_name: (userData.first_name) ? userData.first_name : "",
                        last_name: (userData.last_name) ? userData.last_name : "",
                        email_id: (userData.email_id) ? userData.email_id : "",
                        contact_number: (userData.contact_number) ? userData.contact_number : "",
                        profile_url: ""
                    }
                });
            } catch (error) {
                console.log("Error: ", error);

                if (error == 'exists') {
                    return res.status(200).send({
                        status: 2,
                        message: "Number already used."
                    });
                }
                return res.status(Config.CODES.BAD_REQUEST).send({
                    message: error
                });
            }
        })();
    },


    verifyOtp: (req, res) => {
        (async () => {
            try {
                await validator.validate(req.body, [
                    "user_id",
                    "contact_number",
                    "otp"
                ]);
                var userData = await models.user.findUser({
                    where: {
                        id: req.body.user_id
                    }
                });
                await models.user.updateUser(req.body.user_id, {
                    verify_mobile: 1
                });
                return res.status(200).send({
                    status: 1,
                    message: "success",
                    token: userData.token,
                    data: {
                        id: userData.id,
                        first_name: (userData.first_name) ? userData.first_name : "",
                        last_name: (userData.last_name) ? userData.last_name : "",
                        email_id: (userData.email_id) ? userData.email_id : "",
                        contact_number: (userData.contact_number) ? userData.contact_number : "",
                        profile_url: ""
                    }
                });
            } catch (error) {
                console.log("Error: ", error);

                if (error == 'exists') {
                    return res.status(200).send({
                        status: 2,
                        message: "Number already used."
                    });
                }
                return res.status(Config.CODES.BAD_REQUEST).send({
                    message: error
                });
            }
        })();
    }
}


// --- functions----

function verifyOtp(reqData) {
    return new Promise((resolve, reject) => {
        msg91.verifyOtp(reqData, function (message, data) {
            if (!data)
                reject(message);
            else
                resolve();
        });
    });
}


function login(reqData) {
    return new Promise((resolve, reject) => {
        models.user.userLogin(reqData, (err, response) => {
            if (err)
                reject(err);
            else
                resolve(response);
        })
    });
}