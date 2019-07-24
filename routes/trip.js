import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import checkTrip from '../services/check-trip';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };

router.post('/new-trip', checkAuth, (req, res) => {
  const newTrip = {...params,
    Item: {
      created: Date.now(),
      dataSource: req.userData.email,
      dataKey: 'trip-' + uuidv1().slice(0, 8),
      startTime: req.body.startTime * 1 || Date.now(),
      endTime: req.body.endTime * 1 || Date.now() + 2592000000,
    }
  }
  db.put(newTrip, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New trip created with id ' + newTrip.Item.dataKey
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

router.get('/:trip', checkAuth, checkTrip, (req, res) => {
  db.get({...params, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(data.Item);
    };
  });
});

router.patch('/:trip', checkAuth, checkTrip, (req, res) => {
  const updateParams = {...params, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}
  db.get(updateParams, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      updateParams.UpdateExpression = 'set updated = :updated, startTime = :startTime, endTime = :endTime',
      updateParams.ExpressionAttributeValues = {
        ':updated': Date.now(),
        ':startTime': req.body.startTime * 1 || data.Item.startTime,
        ':endTime': req.body.endTime * 1 || data.Item.endTime
      };
      db.update(updateParams, (error, data) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(202).json({
            message: 'Trip with id ' + req.params.trip + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:trip', checkAuth, checkTrip, (req, res) => {
  db.delete({...params, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(202).json({
        message: 'Trip with id ' + req.params.trip + ' deleted'
      });
    };
  });
});

export default router;