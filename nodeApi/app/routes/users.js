var Users = require('../controller/users');
var express = require('express');
var router = express.Router();

router.get('/:user_id', Users.fetchUserDetails)
router.get('/bookings', Users.fetchUserBookings);

router.patch('/merge_account', Users.mergeUserAccount);

module.exports = router;