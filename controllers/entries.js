import uuidv1 from 'uuid';
import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import deleteEntries from '../services/delete-entries';
import { db } from '../services/aws-config';

const linkRegex = new RegExp(
  '^(https?:\\/\\/)?' +
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
  '((\\d{1,3}\\.){3}\\d{1,3}))' +
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
  '(\\?[;&a-z\\d%_.~+=-]*)?' +
  '(\\#[-a-z\\d_]*)?$','i'
);

export default {
  new: (req, res) => {
    const newEntry = {...req.table,
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
          message: newEntry.Item.dataKey + ' created'
        });
      };
    });
  },
  index: (req, res) => {
    const entryQuery = {...req.table,
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
  },
  read: (req, res) => {
    db.get({...req.table, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.json(data.Item);
      };
    });
  },
  update: (req, res) => {
    const updateParams = {...req.table, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}
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
              message: req.params.entry + ' updated'
            });
          };
        });
      };
    });
  },
  delete: deleteEntries
}