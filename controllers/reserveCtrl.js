import Club from '../models/clubModel.js';
import Admin from '../models/adminModel.js';

const reserveCtrl = {
  create: async (req, res) => {
    try {
      const { clubId, customerData, roomNum } = req.body;
      let isNumber = /^\d+$/.test(customerData);
      if (customerData.length != 10 || isNumber == false) {
        return res.status(400).json({
          message: 'Номер телефона клиента должен содержать 10 цифр!',
        });
      }
      let { from, to } = req.body;
      from = Number(from);
      to = Number(to) + 1;
      if (to - from > 10) {
        return res
          .status(400)
          .json({ message: 'Нельзя бронировать больше 5 часов!' });
      }
      const room = Number(roomNum);
      const club = await Club.findById(clubId);
      if (
        !club ||
        !club.rooms ||
        !club.rooms[room] ||
        !club.rooms[room].availableTimeSlots
      ) {
        return res
          .status(400)
          .json({ message: 'Неверные данные клуба или комнаты!' });
      }
      const setRoom = club.rooms[room];
      for (let i = from; i < to; i++) {
        if (!setRoom.availableTimeSlots[i]) {
          return res
            .status(400)
            .json({ message: 'Выбранное время уже забронировано' });
        }
      }
      for (let i = from; i < to; i++) {
        setRoom.availableTimeSlots[i] = false;
      }
      const reserve = {
        customerData,
        roomName: setRoom.name,
        from,
        to,
      };
      setRoom.bookings.push(reserve);
      await club.save();
      return res.status(200).json({
        message: 'Время успешно забронировано',
        reserve,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { customerData, clubId, roomNum } = req.body;
      let { from, to } = req.body;
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Неверные данные клуба!' });
      } else {
        from = Number(from);
        to = Number(to) + 1;
        const room = Number(roomNum);

        for (let i = from; i < to; i++) {
          club.rooms[room].availableTimeSlots[i] = true;
        }
        const bookingIndex = club.rooms[roomNum].bookings.findIndex(
          (booking) => booking.customerData === customerData
        );
        club.rooms[roomNum].bookings.splice(bookingIndex, 1);
        await club.save();
        return res.status(200).json({ message: 'Бронь успешно удалена' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default reserveCtrl;
