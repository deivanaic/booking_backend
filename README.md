# booking_backend
Requirements:
--------------
User can login to the system.

Clients can create/update a booking.

Partners can apply to booking

Partners can mark the trip as started and completed

Bookings which are not assigned to partners within 15 min should move to expired status

Constraints:
-------------
Bookings can only be created by clients.

Only partners can apply to bookings.

Trip can be started and ended only by the partner who has been assigned to it

Tasks:
------
Design the database for authentication and for storing assigned partners for bookings

Create following APIs:
------------------------
Login and Logout

Create a booking

List most recent bookings (with pagination). Add a filter to fetch bookings for a hub.

Apply on a booking

Start trip

End Trip

Create a background task for marking bookings as expired.