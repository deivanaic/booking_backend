var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
var user_controller = require('../controllers/userController')

router.post('/signup', user_controller.user_signup);
router.get('/', user_controller.get_all_users);
router.post('/login', user_controller.user_login);

// Auth middleware called first before passing the request to server.
router.get('/me', auth, user_controller.user_detail);
router.put('/me/logout', auth, user_controller.user_logout);
module.exports = router;