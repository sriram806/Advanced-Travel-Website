import express from 'express';
import {
  getGalleryItems,
  uploadGalleryItem,
  toggleLike,
  addComment,
  deleteGalleryItem
} from '../controllers/gallery.controller.js';
import userAuth from '../middleware/userAuth.js';

const galleryRoute = express.Router();

galleryRoute.get('/', getGalleryItems);
galleryRoute.post('/', userAuth, uploadGalleryItem);
galleryRoute.put('/:id/like', userAuth, toggleLike);
galleryRoute.post('/:id/comments', userAuth, addComment);
galleryRoute.delete('/:id', userAuth, deleteGalleryItem);

export default galleryRoute;
