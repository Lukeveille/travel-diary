import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();

const params = { TableName: 'trips' };

router.post('/', checkAuth, (req, res) => {
  const newTrip = {...params,
    Item: {
      id: uuidv1(),
      user: req.userData.email,
      start: req.body.start,
      end: req.body.end
    }
  }
  const userUpdate = {
    TableName: 'users',
    Key: { email: req.userData.email }
  }

  db.get(userUpdate, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      const tripList = data.Item.trips
      tripList[0]? tripList.push(newTrip.Item.id) : triplist = [newTrip.Item.id]
      userUpdate.ExpressionAttributeValues = { ':trips': tripList };
      userUpdate.UpdateExpression = 'set trips = :trips';
      db.update(userUpdate, err => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          db.put(newTrip, (error, data) => {
            if (error) {
              res.status(500).json({ error });
            } else {
              res.status(201).json({
                message: 'New trip created'
              });
            };
          });
        }
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
        UpdateExpression: 'set start = :start end = :end',
        ExpressionAttributeValues: {
          ':start': 123456,
          ':end': 456789
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