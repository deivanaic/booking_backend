var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
var booking_controller = require('../controllers/bookingController')

router.get('/', auth, booking_controller.get_all_bookings);
router.post('/create', auth, booking_controller.create_booking);
router.put('/:id/apply', auth, booking_controller.apply_booking);
router.put('/:id/start_trip', auth, booking_controller.start_trip);
router.put('/:id/complete_trip', auth, booking_controller.complete_trip);
router.get('/:id/detail', auth, booking_controller.booking_detail);


module.exports = router;