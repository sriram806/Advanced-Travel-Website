import express from 'express';
import {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
  addReview
} from '../controllers/package.controller.js';

import userAuth from '../middleware/userAuth.js';

const packageRouter = express.Router();

// Public: Get all packages
packageRouter.get('/', getPackages);

// Authenticated (Agency/Admin): Create a new package
packageRouter.post('/', userAuth, createPackage);

// Public: Get single package
packageRouter.get('/:id', getPackage);

// Authenticated (Agency/Admin): Update or delete a package
packageRouter.put('/:id', userAuth, updatePackage);
packageRouter.delete('/:id', userAuth, deletePackage);

// Authenticated users: Add a review
packageRouter.post('/:id/reviews', userAuth, addReview);

export default packageRouter;
