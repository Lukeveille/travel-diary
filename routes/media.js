import express from 'express';
import uuidv1 from 'uuid';
import checkAuth from '../services/check-auth';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };

router.post('/media-entry', checkAuth, (req, res) => {
  const media = {...params,
    Item: {
      dataKey: 'media-' + uuidv1().slice(0, 8),
      timestamp: Date.now(),
      dataSource: req.body.entryId,
      message: req.body.message,
      title: req.body.title,
      link: req.body.link,
      geotag: req.body.geotag
    }
  }
  db.put(media, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New media saved'
      });
    };
  });
});

router.get('/:user/media', checkAuth, (req, res) => {
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

router.get('/:entry/media', checkAuth, (req, res) => {
  
});

router.get('/:media', checkAuth, (req, res) => {
  db.get({...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(200).json(data.Item);
    };
  });
});

router.patch('/:media', checkAuth, (req, res) => {
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

router.delete('/:media', checkAuth, (req, res) => {
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