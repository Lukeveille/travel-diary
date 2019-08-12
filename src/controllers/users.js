import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../services/aws-config';
import deleteUser from './delete-user';

export default {
  signup: (req, res) => {
    const newUser = {...req.table,
      Item: {
        created: Date.now(),
        dataSource: 'user',
        dataKey: req.body.email,
        password: req.hash
      }
    };
    db.put(newUser, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.status(201).json({
          message: 'New user created with e-mail address ' + req.body.email
        });
      };
    });
  },
  login:  (req, res) => {
    const token = jwt.sign(
      { email: req.body.email },
      process.env.TRAVEL_DIARY_JWT_KEY,
      { expiresIn: '1h' }
    );
    res.status(202).json({
      message: "Login successful",
      token
    });
  },
  update: (req, res) => {
    const updatePassword = {...req.table, Key: { dataSource: 'user', dataKey: req.userData.email }}
    
    db.get(updatePassword, (error, data) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        updatePassword.UpdateExpression = 'set updated = :updated, password = :newPassword',
        updatePassword.ExpressionAttributeValues = {
          ':updated': Date.now(),
          ':newPassword': req.newHash
        };
        db.update(updatePassword, (error, data) => {
          if (error) {
            res.status(500).json({ error });
          } else {
            res.status(202).json({
              message: req.userData.email + ' updated password',
            });
          };
        });
      };
    });
  },
  delete: (req, res) => {
    const messages = (error, message) => {
      if (error) {
        res.status(502).json(error)
      } else if (error && message) {
        res.status(502).json({ message, error })
      } else {
        res.status(202).json(message)
      }
    }
    deleteUser(req, res, messages)
  }
};
