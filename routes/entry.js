import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';
import checkEntry from '../middleware/check-entry';
import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import linkRegex from '../services/link-regex';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };

router.post('/:trip/new-entry', checkAuth, checkTrip, (req, res) => {
  const newEntry = {...params,
    Item: {
      created: Date.now(),
      dataSource: req.params.trip,
      dataKey: 'entry-' + uuidv1().slice(0, 8),
      entryTime: req.body.entryTime * 1 || Date.now(),
      message: checkString(req.body.message),
      title: checkString(req.body.title),
      locationName: checkString(req.body.locationName),
      link: linkRegex.test(req.body.link)? req.body.link : null,
      geotag: checkGeo(req.body.geotag)
    }
  };
  db.put(newEntry, error => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New entry created with id ' + newEntry.Item.dataKey
      });
    };
  });
});

router.get('/:trip/entries', checkAuth, checkTrip, (req, res) => {
  const entryQuery = {...params,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :tripId',
    ExpressionAttributeValues: { ':tripId': req.params.trip }
  }
  db.query(entryQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.json(data.Items);
    };
  });
});

router.get('/:trip/:entry', checkAuth, checkTrip, checkEntry, (req, res) => {
  db.get({...params, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.json(data.Item);
    };
  });
});

router.patch('/:trip/:entry', checkAuth, checkTrip, checkEntry, (req, res) => {
  const updateParams = {...params, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}
  db.get(updateParams, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
        updateParams.UpdateExpression = 'set updated = :updated, entryTime = :entryTime, message = :message, title = :title, locationName = :locationName, link = :link, geotag = :geotag',
        updateParams.ExpressionAttributeValues = {
          ':updated': Date.now(),
          ':entryTime': data.Item.entryTime * 1 || data.Item.entryTime,
          ':message': checkString(req.body.message, data.Item.message),
          ':title': checkString(req.body.title, data.Item.title),
          ':locationName': checkString(req.body.locationName, data.Item.locationName),
          ':link': linkRegex.test(req.body.link)? req.body.link : data.Item.link,
          ':geotag': checkGeo(req.body.geotag, data.Item.geotag)
      };
      db.update(updateParams, error => {
        if (error) {
          res.status(502).json({ error });
        } else {
          res.status(202).json({
            message: 'Entry with id ' + req.params.entry + ' updated'
          });
        };
      });
    };
  });
});

router.delete('/:trip/:entry', checkAuth, checkTrip, checkEntry, (req, res) => {
  db.delete({...params, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(202).json({
        message: 'Entry with id ' + req.params.entry + ' deleted'
      });
    };
  });
});

export default router;