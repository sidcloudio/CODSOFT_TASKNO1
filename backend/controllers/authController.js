import User from '../models/User.js';
import Cart from '../models/Cart.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Create cart for user
    await Cart.create({ user: user._id, items: [] });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      addresses: user.addresses,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      addresses: user.addresses,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: user.addresses,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user addresses
// @route   GET /api/auth/addresses
// @access  Private
export const getUserAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
export const addUserAddress = async (req, res) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0,
    });

    const updatedUser = await user.save();
    res.status(201).json(updatedUser.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update address
// @route   PUT /api/auth/addresses/:id
// @access  Private
export const updateUserAddress = async (req, res) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    const updatedUser = await user.save();
    res.json(updatedUser.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
    const updatedUser = await user.save();
    res.json(updatedUser.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
