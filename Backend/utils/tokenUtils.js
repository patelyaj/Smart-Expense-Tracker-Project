import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });

  res.cookie('jwt', token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export default generateTokenAndSetCookie;