import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync user cart
// @route   POST /api/cart
// @access  Private
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // Items array with { product: id, quantity: num }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    cart.items = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
