import { db } from '../services/aws-config';

export default (req, res, next) => {
  db.get({...req.table, Key: { dataSource: 'user', dataKey: req.body.email }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else if (data && Object.entries(data).length > 0) {
      res.status(400).json({ error: 'User already exists!' });
    } else {
      next();
    };
  });
};