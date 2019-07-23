import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };

router.post('/new-trip', checkAuth, (req, res) => {
  const newTrip = {...params,
    Item: {
      dataSource: req.userData.email,
      dataKey: 'trip-' + uuidv1(),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    }
  }
  db.put(newTrip, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New trip created'
      });
    };
  });
});

router.get('/trips', checkAuth, (req, res) => {
  const tripQuery = {...params,
    Key: { dataSource: req.userData.email },
    KeyConditionExpression: 'dataSource = :email',
    ExpressionAttributeValues: { ':email': req.userData.email }
  }
  db.query(tripQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(200).json(data.Items);
    };
  });
});

router.get('/:id', checkAuth, (req, res) => {
  db.get({...params, Key: { dataSource: req.userData.email, dataKey: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(data.Item);
    };
  });
});

router.patch('/:id', checkAuth, (req, res) => {
  const updateParams = {...params, Key: { dataSource: req.userData.email, dataKey: req.params.id }}
  db.get(updateParams, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      updateParams.UpdateExpression = 'set startTime = :startTime, endTime = :endTime',
      updateParams.ExpressionAttributeValues = {
        ':startTime': req.body.startTime || data.Item.startTime,
        ':endTime': req.body.endTime || data.Item.endTime
      };
      db.update(updateParams, (error, data) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(202).json({
            message: 'Trip with id ' + req.params.id + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:id', checkAuth, (req, res) => {
  db.delete({...params, Key: { dataSource: req.userData.email, dataKey: req.params.id }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(202).json({
        message: 'Trip with id ' + req.params.id + ' deleted'
      });
    };
  });
});

export default router;