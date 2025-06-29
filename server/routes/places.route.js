import express from 'express';
import {
  getPlaces,
  getPlace,
  addReview,
  searchNearby,
  addPlace,
  updatePlace,
  deletePlace
} from '../controllers/places.controller.js';

import userAuth from '../middleware/userAuth.js';

const placeRoute = express.Router();

// Public Routes
placeRoute.get('/', getPlaces);
placeRoute.get('/search/nearby', searchNearby);
placeRoute.get('/:id', getPlace);

// Protected Routes
placeRoute.post('/:id/reviews', userAuth, addReview);

// Admin-only routes (optional, recommend for add/update/delete)
placeRoute.post('/', userAuth, addPlace);           // Add place
placeRoute.put('/:id', userAuth, updatePlace);      // Update place
placeRoute.delete('/:id', userAuth, deletePlace);   // Delete place

export default placeRoute;
