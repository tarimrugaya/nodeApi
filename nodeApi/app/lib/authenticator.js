const config = require('../config/app');
const jwt = require('jwt-simple');

module.exports = {
	authenticate: (req, res, next) => {
		var token = getToken(req.headers);

		if (!token) {
			return res.status(config.CODES.UNAUTHORIZED).send({
				message: 'Unauthorized',
				status: 0
			});
		}

		try {
			var decodedToken = jwt.decode(token, config.SECURITY.SALT);
		} catch (err) {
			return res.status(config.CODES.UNAUTHORIZED).send({
				message: 'Unauthorized',
				status: 0
			});
		}
		var models = require('../models');
		var userId = getUserIdFromDecodedToken(decodedToken);
		models.user_token.findAll({
			where: {
				user_id: userId,
				token: token
			}
		}).then((user) => {
			if (user.length == 0) {
				return res.status(config.CODES.UNAUTHORIZED).send({
					message: 'Unauthorized',
					status: 0
				});
			}

			req.user_info = user[0].user_id;
			return next();
		});
	},

	authenticateAdmin: (req, res, next) => {
		var token = getToken(req.headers);

		if (!token) {
			return res.status(config.CODES.UNAUTHORIZED).send({
				message: 'Unauthorized',
				status: 0
			});
		}

		try {
			var decodedToken = jwt.decode(token, config.SECURITY.SALT);
		} catch (err) {
			return res.status(config.CODES.UNAUTHORIZED).send({
				message: 'Unauthorized',
				status: 0
			});
		}
		var models = require('../models');
		var userId = getUserIdFromDecodedToken(decodedToken);
		models.admin_token.findAll({
			where: {
				user_id: userId,
				token: token
			}
		}).then((user) => {
			if (user.length == 0) {
				return res.status(config.CODES.UNAUTHORIZED).send({
					message: 'Unauthorized',
					status: 0
				});
			}

			req.user_info = user[0].user_id;
			return next();
		});
	},


	generateToken: (userInfo, callback) => {

		if (typeof userInfo != 'object') {
			return callback('Invalid user data.');
		}

		if (userInfo.id == undefined) {
			return callback('Invalid user data.');
		}

		// ** Generating current date to randomise token
		let now = new Date();
		let generatedToken = jwt.encode(userInfo.id + '_' + now, config.SECURITY.SALT);

		userInfo.token = generatedToken;

		return callback(false, userInfo);
	}

}


// ========================================== FUNCTIONS ==========================================
var getToken = (headers) => {

	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');

		if (parted.length != 2) {
			return null;
		}

		if (parted[0] != 'Bearer') {
			return null;
		}

		return parted[1];

	} else {
		return null;
	}
};

var getUserIdFromDecodedToken = (decodedToken) => {

	var parted = decodedToken.split('_');
	return parted[0];
}