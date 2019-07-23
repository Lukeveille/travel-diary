import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.TRAVEL_DIARY_JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Auth failed'
    });
  }
}