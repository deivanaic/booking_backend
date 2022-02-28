var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
var hub_controller = require('../controllers/hubController')

router.get('/', auth, hub_controller.get_all_hubs);
router.post('/create', auth, hub_controller.create_hub);
router.get('/:id/detail', auth, hub_controller.hub_detail);
router.get('/:id/bookings', auth, hub_controller.get_hub_bookings)
module.exports = router;