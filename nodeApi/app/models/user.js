const _ = require("underscore");
const msg91 = require("../lib/msg91");

module.exports = function (sequelize, DataTypes) {
  const Op = sequelize.Op;
  const user = sequelize.define("user", {
    login_type: {
      type: DataTypes.INTEGER
    },
    social_login_id: {
      type: DataTypes.STRING
    },
    email_id: {
      type: DataTypes.STRING
    },
    countrycode_id: {
      type: DataTypes.INTEGER
    },
    countrycode: {
      type: DataTypes.INTEGER
    },
    contact_number: {
      type: DataTypes.STRING
    },
    full_name: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATEONLY
    },
    Login_id: {
      type: DataTypes.STRING
    },
    wallet_amount: {
      type: DataTypes.FLOAT
    },
    credit_amount: {
      type: DataTypes.FLOAT
    },
    booking_count: {
      type: DataTypes.INTEGER
    },
    verify_email_code: {
      type: DataTypes.INTEGER
    },
    verify_contact_code: {
      type: DataTypes.INTEGER
    },
    is_email_verified: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_mobile_verified: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    device_type: {
      type: DataTypes.INTEGER
    },
    device_token: {
      type: DataTypes.STRING
    },
    fcm_token: {
      type: DataTypes.STRING
    },
    Forgot_password_flag: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    Forgot_password_value: {
      type: DataTypes.STRING
    },
    created_date: {
      type: DataTypes.DATEONLY
    },
    timestamp: {
      type: DataTypes.STRING
    },
    blocked: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_seen: {
      type: DataTypes.STRING
    }
  });
  // user.sync().then(() => {});

  user.findUser = whereCondition => {
    return new Promise((resolve, reject) => {
      user
        .findOne(whereCondition)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  user.addUser = inputData => {
    return new Promise((resolve, reject) => {
      user
        .create(inputData)
        .then(response => {
          resolve(
            response.get({
              plain: true
            })
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  user.updateUser = (userId, inputData) => {
    return new Promise((resolve, reject) => {
      var valuesToBeUpdated = new Object();

      if (inputData.email_id) {
        valuesToBeUpdated.email_id = inputData.email_id;
      }

      if (inputData.name) {
        valuesToBeUpdated.full_name = inputData.name;
      }

      if (inputData.login_type && inputData.login_type == 2) {
        valuesToBeUpdated.is_email_verified = 1;
      }

      if (inputData.verify_mobile && inputData.verify_mobile == 1) {
        valuesToBeUpdated.is_mobile_verified = 1;
      }

      if (_.isEmpty(valuesToBeUpdated)) {
        resolve();
      } else {
        user
          .update(valuesToBeUpdated, {
            where: {
              id: userId
            }
          })
          .then(result => {
            resolve();
          })
          .catch(err => {
            reject("Error while updating user details during login.");
          });
      }
    });
  };

  user.getUserToken = userObj => {
    return new Promise((resolve, reject) => {
      sequelize.models.user_token.GetUserToken(userObj, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  };

  user.checkIfNumberExists = reqData => {
    return new Promise((resolve, reject) => {
      user
        .findOne({
          where: {
            login_type: {
              [Op.ne]: reqData.login_type
            },
            contact_number: reqData.contact_number,
            is_mobile_verified: 1
          }
        })
        .then(response => {
          if (response) reject("exists");
          else resolve();
        })
        .catch(err => {
          reject("Error while searching for email/contact_number.");
        });
    });
  };

  user.sendOtp = (userCheckFlag, userDetails) => {
    return new Promise((resolve, reject) => {
      if (userCheckFlag) {
        resolve();
      } else {
        //send otp to user
        var userObj = {
          contact_number: userDetails.contact_number
        };
        msg91.sendOtp(userObj, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  };

  user.userLogin = (reqData, callback) => {
    switch (reqData.login_type) {
      case 1: //fb login
        (async () => {
          try {
            var userCheck = await user.findUser({
              where: {
                login_type: reqData.login_type,
                social_login_id: reqData.login_id
              },
              raw: true
            });

            var userDetails = userCheck ?
              userCheck :
              await user.addUser({
                login_type: reqData.login_type,
                social_login_id: reqData.login_id
              });

            await user.updateUser(userDetails.id, reqData);

            var userTokenData = await user.getUserToken(userDetails);

            return callback(false, userTokenData);
          } catch (error) {
            console.log("Error in fb login", error);
            return callback(error);
          }
        })();

        break;
      case 2: // google login
        (async () => {
          try {
            var userCheck = await user.findUser({
              where: {
                login_type: reqData.login_type,
                social_login_id: reqData.login_id
              },
              raw: true
            });

            var userDetails = userCheck ?
              userCheck :
              await user.addUser({
                login_type: reqData.login_type,
                social_login_id: reqData.login_id
              });

            await user.updateUser(userDetails.id, reqData);

            var userTokenData = await user.getUserToken(userDetails);

            return callback(false, userTokenData);
          } catch (error) {
            console.log("Error in google login", error);
            return callback(error);
          }
        })();

        break;

      case 3:
        (async () => {
          try {
            // await user.checkIfNumberExists(reqData);
            var userCheck = await user.findUser({
              where: {
                // login_type: reqData.login_type,
                contact_number: reqData.contact_number
              },
              raw: true
            });

            var userDetails = userCheck ?
              userCheck :
              await user.addUser({
                login_type: reqData.login_type,
                contact_number: reqData.contact_number
              });

            await user.sendOtp(userCheck, userDetails);

            var userTokenData = await user.getUserToken(userDetails);

            return callback(false, userTokenData);
          } catch (error) {
            console.log("Error in email login", error);
            return callback(error);
          }
        })();
        break;
      default:
        reject("Invalid login type.");
        break;
    }
  };

  user.mergeAccount = reqData => {
    return new Promise((resolve, reject) => {
      "existing_user_id",
      "new_user_id";
    });
  };

  user.deductUserAmount = (reqData) => {
    return new Promise((resolve, reject) => {
      user.findOne({
        attributes: ['wallet_amount', 'credit_amount'],
        where: {
          id: userId
        }
      }).then((result) => {
        resolve(result);
      }).catch((err) => {
        console.log(err);
        reject("Error while fetching wallet and cashback amount");
      });
    });
  }

  return user;
};