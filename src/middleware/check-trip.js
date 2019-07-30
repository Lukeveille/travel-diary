import { db } from '../services/aws-config';

export default (req, res, next) => {
  db.get({...req.table, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      if (data.Item) {
        next();
      } else {
        res.status(401).json({
          error: 'Auth failed'
        });
      };
    };
  });
};