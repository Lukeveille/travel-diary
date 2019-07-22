import express from 'express';
import { db } from '../services/aws-config';

const router = express.Router();

const params = { TableName: 'users' };

router.put('/', (req, res) => {
  db.get({...params, Key: { email_id: req.body.email_id }}, (error, data) => {
    if (Object.entries(data).length > 0) {
      res.status(500).json({ error: "User with that email already exists"});
    } else {
      db.put({...params, Item: req.body }, (error, data) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(201).json({
            message: 'New user created with e-mail address ' + req.body.email_id
          });
        };
      });
    }
  })
});

router.get('/:id', (req, res) => {
  db.get({...params, Key: { email_id: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json(data.Item);
    };
  });
});

router.patch('/:id', (req, res) => {
  db.get({...params, Key: { email_id: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      const updates = {...params,
        Key: { email_id: req.params.id },
        UpdateExpression: 'set username = :username',
        ExpressionAttributeValues: {
          ':username': req.body.username || data.Item.username
        }
      };
      db.update(updates, (error, data) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(201).json({
            message: 'User with e-mail address ' + req.params.id + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:id', (req, res) => {
  db.delete({...params, Key: { email_id: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({
        message: 'User with e-mail address ' + req.params.id + ' deleted'
      });
    };
  });
});

export default router;