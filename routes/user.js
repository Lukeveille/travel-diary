import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const checkCredentials = (req, res, next) => {
  if (!req.body.password) {
    res.status(400).json({ error: 'Password required!' });
  } else if (!emailRegex.test(req.body.email)) {
    res.status(400).json({ error: 'Not a valid e-mail!' });
  } else {
    next();
  }
};
const verifyUser = (req, res, next) => {
  if (req.userData.email === req.params.email) {
    next();
  } else {
    res.status(401).json({ error: 'Can only delete logged in user' });
  }
};
const validateUser = (req, res, next) => {
  const dataKey = req.body.email || req.params.email
  db.get({...params, Key: { dataSource: 'user', dataKey }}, (error, data) => {
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

router.post('/signup', checkCredentials, (req, res) => {
  db.get({...params, Key: { dataSource: 'user', dataKey: req.body.email }}, (er, data) => {
    if (er) {
      res.status(502).json({ error: er });
    } else if (data && Object.entries(data).length > 0) {
      res.status(400).json({ error: 'User already exists!' });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(400).json({ error: "Invalid password"});
        } else {
          const newUser = {...params,
            Item: {
              created: Date.now(),
              dataSource: 'user',
              dataKey: req.body.email,
              password: hash
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
        };
      });
    };
  });
});

router.post('/login', validateUser, (req, res) => {
  const token = jwt.sign(
    { email: req.body.email },
    process.env.TRAVEL_DIARY_JWT_KEY,
    { expiresIn: '1h' }
  );
  res.status(202).json({
    message: "Login successful",
    token
  });
});

router.delete('/:email', checkAuth, validateUser, verifyUser, (req, res) => {
  db.delete({...params, Key: { dataSource: 'user', dataKey: req.params.email }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(202).json({
        message: 'User with e-mail address ' + req.params.email + ' deleted'
      });
    };
  });
});

export default router;