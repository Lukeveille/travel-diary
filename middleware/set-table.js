export default (req, res, next) => {
  req.table = { TableName: 'trip-diary' };
  next();
};