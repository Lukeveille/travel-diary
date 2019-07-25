import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TRAVEL_DIARY_JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Auth failed'
    });
  }
}