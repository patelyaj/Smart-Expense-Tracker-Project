import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' }); //15 day both

  res.cookie('jwt', token, {
  maxAge: 15 * 24 * 60 * 60 * 1000, //15 day
  httpOnly: true,
  sameSite: "None",
  secure: true
});

};

export default generateTokenAndSetCookie;