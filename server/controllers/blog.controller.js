import Blog from '../models/Blog.js';

export const getBlogPosts = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = { status: 'published' };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
      ];
    }

    const posts = await Blog.find(query)
      .populate('author', 'name')
      .populate('location', 'name')
      .sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
export const getBlogPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate('author', 'name')
      .populate('location', 'name')
      .populate('comments.user', 'name');

    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private
export const createBlogPost = async (req, res) => {
  try {
    const blogPost = new Blog({
      ...req.body,
      author: req.user._id,
    });
    const savedPost = await blogPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
export const updateBlogPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.json({ message: 'Blog post removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Like/Unlike blog post
// @route   PUT /api/blog/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex === -1) post.likes.push(req.user._id);
    else post.likes.splice(likeIndex, 1);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Blog.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Blog post not found' });

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
