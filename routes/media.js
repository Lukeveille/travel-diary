import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();

const params = { TableName: 'trip-diary' };

router.post('/', checkAuth, (req, res) => {
  const newTrip = {...params,
    Item: {
      primary: req.userData.email,
      sort: 'trip-' + uuidv1(),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
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

router.get('/:id', checkAuth, (req, res) => {
  db.get({...params, Key: { primary: req.userData.email, sort: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json(data.Item);
    };
  });
});

router.patch('/:id', checkAuth, (req, res) => {
  const updateParams = {...params, Key: { primary: req.userData.email, sort: req.params.id }}
  db.get(updateParams, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      const updates = {...updateParams,
        UpdateExpression: 'set startTime = :startTime, endTime = :endTime',
        ExpressionAttributeValues: {
          ':startTime': req.body.startTime || data.Item.startTime,
          ':endTime': req.body.endTime || data.Item.endTime
        }
      };
      db.update(updates, (error, data) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(201).json({
            message: 'Trip with id ' + req.params.id + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:id', checkAuth, (req, res) => {
  db.delete({...params, Key: { primary: req.userData.email, sort: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({
        message: 'Trip with id ' + req.params.id + ' deleted'
      });
    };
  });
});

export default router;