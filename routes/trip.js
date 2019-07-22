import express from 'express';
import uuidv1 from 'uuid';
import { db } from '../services/aws-config';

const router = express.Router();

const params = { TableName: 'trips' };

router.post('/', (req, res) => {
  const newTrip = {...params,
    Item: {
      id: uuidv1(),
      user: req.body.email,
      start: req.body.start,
      end: req.body.end
    }
  }
  db.put(newTrip, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({
        message: 'New trip created'
      });
    };
  });
});

router.get('/:id', (req, res) => {
  db.get({...params, Key: { id: req.params.id }}, (error, data) => {
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