import uuidv1 from 'uuid';

export default (req, res, next) => {
  req.mediaId = uuidv1().slice(0, 8);
  next();
};