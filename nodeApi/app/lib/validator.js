module.exports = {
	validate: (details, keyData) => {

		return new Promise((resolve, reject) => {
			for (var i = 0; i < keyData.length; i++) {
				var key = keyData[i];
				if (!details[key]) {
					reject(`${key.replace(/_/g, ' ')} is required`);
				}
			}
			resolve();
		});

	}

}