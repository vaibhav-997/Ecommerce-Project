import express from 'express';
import {UserController} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { authUser } from '../middlewares/user.middleware.js';

const router = express.Router();


router.post('/register', upload.single("avatar"),UserController.registerUser)
router.post('/login',UserController.loginUser)
router.get('/refreshToken',UserController.refreshAccessToken)
router.get('/logout', authUser,UserController.logoutUser)
router.get('/currentUser', authUser,UserController.getCurrentUser)
router.patch('/update-avatar', authUser,upload.single("avatar"),UserController.updateUserAvatar)
router.patch('/update-password', authUser,UserController.updateUserPassword)




export default router