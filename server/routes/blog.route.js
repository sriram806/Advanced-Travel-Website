import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleLike,
  addComment
} from '../controllers/blog.controller.js';

import userAuth from '../middleware/userAuth.js';

const blogRoute = express.Router();

// Public routes
blogRoute.get('/', getBlogPosts);              // Get all published blogs
blogRoute.get('/:id', getBlogPost);            // Get single blog post by ID

// Protected routes
blogRoute.post('/', userAuth, createBlogPost); 
blogRoute.put('/:id', userAuth, updateBlogPost);               // Update blog post
blogRoute.delete('/:id', userAuth, deleteBlogPost);            // Delete blog post
blogRoute.put('/:id/like', userAuth, toggleLike);              // Like or unlike blog post
blogRoute.post('/:id/comments', userAuth, addComment);         // Add comment to blog post

export default blogRoute;
