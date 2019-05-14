const fs = require('fs');
const sharp = require('sharp');
var Config = require('../config/app');

module.exports = {
    uploadProfileImage: (pathName, imageName, callback) => {
        fs.readFile(pathName, (err, data) => {
            // If there's an error
            if (!imageName) {
                console.log(err);
                return callback('Not able to upload image, please try again', false);
            }
            var uploadPath = Config.upload_path + imageName;
            fs.writeFile(uploadPath, data, (err) => {
                sharp.cache(false);
                sharp(uploadPath)
                    .resize(350, 350, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
                    })
                    .toFile(Config.profile_image_uploadpath + imageName)
                    .then((outputBuffer) => {
                        fs.unlinkSync(Config.upload_path + imageName);
                        return callback(false, {
                            name: imageName
                        });
                    });
            });
        })
    },

    uploadProfileImage: (pathName, imageName, callback) => {
        fs.readFile(pathName, (err, data) => {
            // If there's an error
            if (!imageName) {
                console.log(err);
                return callback('Not able to upload image, please try again', false);
            }
            var uploadPath = Config.upload_path + imageName;
            fs.writeFile(uploadPath, data, (err) => {
                sharp.cache(false);
                sharp(uploadPath)
                    .resize(350, 350, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
                    })
                    .toFile(Config.profile_image_uploadpath + imageName)
                    .then((outputBuffer) => {
                        fs.unlinkSync(Config.upload_path + imageName);
                        return callback(false, {
                            name: imageName
                        });
                    });
            });
        })
    },


    uploadPostImage: (pathName, imageName, type, callback) => {
        fs.readFile(pathName, (err, data) => {
            // If there's an error
            if (!imageName) {
                return callback('Not able to upload image, please try again', false);
            }

            var tempUploadPath = Config.upload_path + imageName
            var uploadPath = (type == 1) ? Config.post_image_uploadpath + imageName : 'C:/xampp/htdocs/uploads/saved_post_images/' + imageName;

            fs.writeFile(tempUploadPath, data, (err) => {
                sharp.cache(false);
                sharp(tempUploadPath)
                    .resize({
                        height: 500,
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
                    })
                    .toFile(uploadPath)
                    .then((outputBuffer) => {
                        fs.unlinkSync(tempUploadPath);
                        return callback(false, {
                            name: imageName
                        });
                    });
            });
        })

    },



}