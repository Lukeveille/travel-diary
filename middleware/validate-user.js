import bcrypt from 'bcrypt';
import { db } from '../services/aws-config';

export default (req, res, next) => {
  const dataKey = req.body.email || req.params.email
  db.get({...req.table, Key: { dataSource: 'user', dataKey }}, (error, data) => {
    console.log(data)
    if (error) {
      res.status(502).json({ error });
    } else if (!data || data && Object.entries(data).length === 0) {
      res.status(401).json({ error: 'Auth failed' });
    } else {
      bcrypt.compare(req.body.password, data.Item.password, (err, result) => {
        if (err) {
          res.status(401).json({ error: 'Password required' });
        } else if (result) {
          next();
        } else {
          res.status(401).json({ error: 'Auth failed' });
        };
      });
    };
  });
};