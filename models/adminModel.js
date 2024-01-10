import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  clubId: { type: mongoose.Types.ObjectId, ref: 'club' },
  phone: { type: String, unique: true },
  password: String,
});

export default mongoose.model('admin', adminSchema);
