import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoutes } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/updateprofile',protectRoutes,updateProfile)
router.get('/checkauth',protectRoutes,checkAuth)

export default router;