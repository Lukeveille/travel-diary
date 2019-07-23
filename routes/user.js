import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

router.post('/signup', (req, res) => {
  if (!req.body.password) {
    res.status(401).json({ error: 'Password required!' })
  } else if (!emailRegex.test(req.body.email)) {
    res.status(401).json({ error: 'Not a valid e-mail!' })
  } else {
    db.get({...params, Key: { primary: 'user', sort: req.body.email }}, (er, data) => {
      if (er) {
        res.status(500).json({ error: er });
      } else if (data && Object.entries(data).length > 0) {
        res.status(500).json({ error: 'User already exists!' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err});
          } else {
            const newUser = {...params,
              Item: {
                primary: 'user',
                sort: req.body.email,
                password: hash
              }
            };
            db.put(newUser, (error, data) => {
              if (error) {
                res.status(500).json({ error });
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
  };
});

router.post('/login', (req, res) => {
  db.get({...params, Key: { primary: 'user', sort: req.body.email }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else if (!data || data && Object.entries(data).length === 0) {
      res.status(401).json({ error: 'Auth failed' });
    } else {
      bcrypt.compare(req.body.password, data.Item.password, (err, result) => {
        if (err) {
          res.status(401).json({ error: "Password required" });
        } else if (result) {
          const token = jwt.sign(
            { email: req.body.email },
            process.env.TRAVEL_DIARY_JWT_KEY,
            { expiresIn: '1h' }
          );
          res.status(201).json({
            message: "Login successful",
            token
          });
        } else {
          res.status(401).json({ error: 'Auth failed' });
        };
      });
    };
  });
});

router.delete('/delete/:email', (req, res) => {
  db.get({...params, Key: { primary: 'user', sort: req.body.email }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else if (!data || data && Object.entries(data).length === 0) {
      res.status(401).json({ error: 'Auth failed' });
    } else {
      bcrypt.compare(req.body.password, data.Item.password, (err, result) => {
        if (err) {
          res.status(401).json({ error: 'Password required' });
        } else if (result) {
          db.delete({...params, Key: { primary: 'user', sort: req.body.email }}, (error, data) => {
            if (error) {
              res.status(500).json({ error });
            } else {
              res.status(201).json({
                message: 'User with e-mail address ' + req.params.email + ' deleted'
              });
            };
          });
        } else {
          res.status(401).json({ error: 'Auth failed' });
        };
      });
    };
  });
});

export default router;