const Queue = require('bull')
const Redis = require('redis')
const redis_client = Redis.createClient()

const booking = require('./models/bookingModel')
const options = {
    repeat: {
        every: 1000, // 1 sec
        limit: 100
    }
}

exports.background_task = function(){
    const trigger_queue = new Queue('status-update');
    trigger_queue.add({}, options)
    trigger_queue.process(async (job) => {
      bookings = await booking.find({'created_at': {$lt: new Date(Date.now() - 1*60*1000)}});
      bookings.forEach(async (a) => {
          if(a.status == 'created'){
              a.status = 'assigned';
              a.save()
          }
      })
          
      
    });
  }

// module.exports = background_task;