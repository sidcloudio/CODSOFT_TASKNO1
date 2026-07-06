import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Fetch all products with queries
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // 1. Keyword search (name or description)
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    // 2. Category Filter (Check slug or direct ID)
    if (category) {
      const foundCategory = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // If category is not found, return empty results
        return res.json([]);
      }
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Sorting logic
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'priceAsc') sortOptions = { price: 1 };
      else if (sort === 'priceDesc') sortOptions = { price: -1 };
      else if (sort === 'popularity') sortOptions = { rating: -1, numReviews: -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query).populate('category', 'name slug').sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product with reviews
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      const reviews = await Review.find({ product: product._id }).populate('user', 'name');
      res.json({ product, reviews });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        product: product._id,
        user: req.user._id,
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        product: product._id,
      });

      await review.save();

      // Recalculate rating
      const reviews = await Review.find({ product: product._id });
      product.numReviews = reviews.length;
      product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, brand, countInStock, isFeatured } = req.body;

    const product = new Product({
      name,
      description,
      price: Number(price),
      images: images && images.length > 0 ? images : ['/placeholder.jpg'],
      category,
      brand,
      countInStock: Number(countInStock),
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, brand, countInStock, isFeatured } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.images = images || product.images;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
