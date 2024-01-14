import Admin from '../models/adminModel.js';
import Club from '../models/clubModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminCtrl = {
  signup: async (req, res) => {
    try {
      const { phone, password, clubId } = req.body;
      let isNumber = /^\d+$/.test(phone);
      if (phone.length != 10 || isNumber == false) {
        return res
          .status(400)
          .json({ message: 'Номер телефона должен содержать 10 цифр!' });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Пароль не должен быть меньше 6 символов!' });
      }
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(400).json({
          message: 'Клуба с таким ID не существует!',
        });
      }
      const admin = await Admin.findOne({ phone });
      if (admin) {
        return res.status(400).json({
          message: 'Администратор с таким номером телефона уже существует!',
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 8);
        await Admin.create({
          phone,
          password: hashPassword,
          clubId,
        });
        return res.status(200).json({
          message: 'Вы успешно зарегистрировались!',
          club: { name: club.name, phone: club.phone },
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Пароль не должен быть меньше 6 символов!' });
      }
      const admin = await Admin.findOne({ phone });
      if (!admin) {
        return res.status(400).json({
          message: 'Администратора с таким номером телефона не существует!',
        });
      } else {
        const isCorrect = await bcrypt.compare(password, admin.password);
        if (isCorrect) {
          const access_token = createAccessToken({ id: admin._id });
          const refresh_token = createRefreshToken({ id: admin._id });
          res.cookie('refreshToken', refresh_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/api/refresh_token',
            httpOnly: true,
          });
          return res.status(200).json({
            message: 'Вы успешно авторизовались!',
            admin: {
              clubId: admin.clubId,
              phone: admin.phone,
            },
            token: access_token,
          });
        } else {
          return res.status(400).json({ message: 'Неверный пароль!' });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken', { path: '/api/refresh_token' });
      return res.status(200).json({ message: 'Logged out!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ message: 'Пожалуйста войдите' });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err)
            return res.status(400).json({ message: 'Пожалуйста, войдите.' });
          const admin = await Admin.findById(result.id);
          if (!admin)
            return res
              .status(400)
              .json({ message: 'Такого администратора не существует!' });
          const refresh_token = createRefreshToken({ id: admin._id });
          res.cookie('refreshToken', refresh_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/api/refresh_token',
            httpOnly: true,
          });
          const access_token = createAccessToken({ id: result.id });
          return res.json({
            token: access_token,
            admin: {
              clubId: admin.clubId,
              phone: admin.phone,
            },
            message: 'Вы авторизованы'
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
};

export default adminCtrl;
