const models = require('../models');
const validator = require('../lib/validator');


module.exports = {
    fetchUserBookings: (req, res) => {
        (async () => {
            try {
                var userBookings = await getUserBookings(userId);
                return res.send({
                    status: 1,
                    message: "success",
                    data: userBookings
                });
            } catch (error) {
                console.log("Error: ", error);
                return res.send(error);
            }
        })();
    },

    mergeUserAccount: (req, res) => {
        (async () => {
            try {
                await validator.validate(req.body, [
                    "existing_user_id",
                    "new_user_id"
                ]);

                await models.user.mergeAccount(req.body);

                return res.status(200).send({
                    status: 1,
                    message: "success",
                    token: userData.token,
                    data: {
                        id: userData.id,
                        first_name: (userData.first_name) ? userData.first_name : "",
                        last_name: (userData.last_name) ? userData.last_name : "",
                        email_id: (userData.email_id) ? userData.email_id : "",
                        contact_number: (userData.contact_number) ? userData.contact_number : ""
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
                    message: err
                });
            }
        })();
    },

    fetchUserDetails: (req, res) => {
        (async () => {
            try {
                var userDetails = await models.user.findUser({
                    where: {
                        id: req.params.user_id
                    }
                })

                console.log(userDetails)
                return res.send({
                    status: 1,
                    message: "success",
                    data: {
                        id: (userDetails) ? userDetails.id : '',
                        name: (userDetails) ? userDetails.full_name : '',
                        email_id: (userDetails) ? userDetails.email_id : '',
                        contact_number: (userDetails) ? userDetails.contact_number : ''
                    }
                });
            } catch (error) {
                console.log("Error: ", error);
                return res.send(error);
            }
        })();
    }
}