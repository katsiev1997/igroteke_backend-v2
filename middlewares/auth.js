import Admin from '../models/adminModel.js' 
import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).json({ msg: "Вы не авторизованы." });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(400).json({ msg: "Необходимо авторизоваться." });
    const admin = await Admin.findOne({ _id: decoded.id });
    req.body.clubId = admin.clubId;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
