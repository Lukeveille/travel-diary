import uuidv1 from 'uuid';
import { db } from '../services/aws-config';
import deleteTrips from './delete-trips';

export default {
  new: (req, res) => {
    const newTrip = {...req.table,
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
          message: newTrip.Item.dataKey + ' created'
        });
      };
    });
  },
  read: (req, res) => {
    db.get({...req.table, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json(data.Item);
      };
    });
  },
  index: (req, res) => {
    const tripQuery = {...req.table,
      Key: { dataSource: req.userData.email },
      KeyConditionExpression: 'dataSource = :email',
      ExpressionAttributeValues: { ':email': req.userData.email }
    }
    db.query(tripQuery, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.json(data.Items);
      };
    });
  },
  update: (req, res) => {
    const updateParams = {...req.table, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}
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
              message: req.params.trip + ' updated'
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
    deleteTrips(req, res, messages)
  }
};