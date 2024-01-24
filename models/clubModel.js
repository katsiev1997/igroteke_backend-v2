import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  roomsNumber: { type: Number, required: true },
  rooms: {
    type: [
      {
        name: String,
        availableTimeSlots: {
          type: [Boolean],
          default: [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
        },
        bookings: [
          {
            _id: String,
            customerData: String,
            roomName: String,
            from: Number,
            to: Number,
          },
          // ... additional bookings
        ],
      },
      // ... additional rooms
    ],
    default: [],
  },
});

export default mongoose.model('club', clubSchema);
