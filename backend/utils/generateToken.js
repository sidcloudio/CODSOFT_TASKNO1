import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'neocartx_jwt_secret_key_2026_glowing_aurora', {
    expiresIn: '30d',
  });
};

export default generateToken;
