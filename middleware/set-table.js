export default (req, res, next) => {
  req.table = { TableName: global.gConfig.database };
  next();
};