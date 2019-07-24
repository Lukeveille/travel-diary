import { db } from './aws-config';

export default (req, res, next) => {
  db.get({TableName: 'trip-diary', Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
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