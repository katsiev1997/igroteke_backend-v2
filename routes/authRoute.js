import express from 'express';
import adminCtrl from '../controllers/adminCtrl.js';

const router = express.Router();

router.post('/login', adminCtrl.login);
router.post('/signup', adminCtrl.signup);
router.post('/logout', adminCtrl.logout);
router.get('/refresh_token', adminCtrl.generateAccessToken);

export default router;
