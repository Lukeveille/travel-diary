import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };

router.post('/new-entry', checkAuth, (req, res) => {
  const newEntry = {...params,
    Item: {
      dataKey: 'entry-' + uuidv1(),
      user: req.userData.email,
      timestamp: Date.now(),
      dataSource: req.body.tripId,
      message: req.body.message,
      title: req.body.title,
      locationName: req.body.locationName,
      link: req.body.link,
      geotag: req.body.geotag
    }
  }
  db.put(newEntry, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New entry created'
      });
    };
  });
});

router.get('/:trip/entries', checkAuth, (req, res) => {
  const entryQuery = {...params,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :tripId',
    ExpressionAttributeValues: { ':tripId': req.params.trip }
  }
  db.query(entryQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(200).json(data.Items);
    };
  });
});

router.get('/:trip/:id', checkAuth, (req, res) => {
  db.get({...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(200).json(data.Item);
    };
  });
});

router.patch('/:trip/:id', checkAuth, (req, res) => {
  const updateParams = {...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}
  db.get(updateParams, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
        updateParams.UpdateExpression = 'set message = :message, title = :title, locationName = :locationName, link = :link, geotag = :geotag',
        updateParams.ExpressionAttributeValues = {
          ':message': req.body.message || data.Item.message,
          ':title': req.body.title || data.Item.title,
          ':locationName': req.body.locationName || data.Item.locationName,
          ':link': req.body.link || data.Item.link,
          ':geotag': req.body.geotag || data.Item.geotag
      };
      db.update(updateParams, (error, data) => {
        if (error) {
          res.status(502).json({ error });
        } else {
          res.status(202).json({
            message: 'Trip with id ' + req.params.id + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:trip/:id', checkAuth, (req, res) => {
  db.delete({...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(202).json({
        message: 'Trip with id ' + req.params.id + ' deleted'
      });
    };
  });
});

export default router;