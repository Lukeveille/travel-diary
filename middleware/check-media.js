import { db } from '../services/aws-config';

export default (req, res, next) => {
  db.get({...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      if (data.Item) {
        req.filename = data.Item.filename
        next();
      } else {
        res.status(400).json({
          error: 'Invalid media ID'
        });
      };
    };
  });
};