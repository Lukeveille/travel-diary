import { db } from '../services/aws-config';

export default (req, res, next) => {
  db.get({...req.table, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      if (data.Item) {
        next();
      } else {
        res.status(400).json({
          error: 'Invalid entry ID'
        });
      };
    };
  });
};