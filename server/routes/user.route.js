import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getProfile, updateProfile, getSavedItems, addSavedItem, removeSavedItem} from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.get('/profile', userAuth, getProfile);
userRoute.put('/profile', userAuth, updateProfile);

userRoute.post('/saved-items', userAuth, addSavedItem);
userRoute.get('/saved-items', userAuth, getSavedItems);
userRoute.delete('/saved-items/:itemId', userAuth, removeSavedItem);

export default userRoute;