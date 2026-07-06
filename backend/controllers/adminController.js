import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Core counters
    const usersCount = await User.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const ordersCount = await Order.countDocuments({});
    const categoriesCount = await Category.countDocuments({});

    // 2. Sales calculations
    const paidOrders = await Order.find({ isPaid: true });
    const totalSales = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // 3. Low stock count
    const lowStockCount = await Product.countDocuments({ countInStock: { $lte: 5 } });

    // 4. Sales analytics (grouped by month or last 7 days)
    // For simplicity, let's extract sales by date in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalAmount: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format salesHistory array for easy rendering in frontend graphs
    const formattedHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = salesHistory.find((item) => item._id === dateStr);
      formattedHistory.push({
        date: dateStr,
        sales: match ? match.totalAmount : 0,
        orders: match ? match.count : 0,
      });
    }

    // 5. Recent orders list
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. User list details (excluding password)
    const usersList = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(10);

    res.json({
      metrics: {
        usersCount,
        productsCount,
        ordersCount,
        categoriesCount,
        totalSales,
        lowStockCount,
      },
      salesHistory: formattedHistory,
      recentOrders,
      usersList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
