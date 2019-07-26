import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import { db } from '../services/aws-config';
import { s3 } from '../services/aws-config';

const cloudFront = 'https://d3k3ewady7k3ym.cloudfront.net/';

export default {
  new: (req, res) => {
    const mediaLink = req.files[0].location.replace(
      'https://travel-diary.s3.us-east-2.amazonaws.com/',
      cloudFront
    )
    const media = {...req.table,
      Item: {
        created: Date.now(),
        dataKey: req.files[0].mimetype.split('/')[0] + '-' + req.mediaId,
        dataSource: req.params.entry,
        link: mediaLink,
        filename: req.mediaId + '_' + req.files[0].originalname,
        fileType: req.files[0].mimetype,
        title: checkString(req.body.title),
        message: checkString(req.body.message),
        geotag: checkGeo({lat: req.body.lat, long: req.body.long})
      }
    };
    db.put(media, error => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.status(201).json({
          message: media.Item.dataKey + ' created: ' + mediaLink
        });
      };
    });
  },
  index: (req, res) => {
    const entryQuery = {...req.table,
      Key: { dataSource: req.params.trip },
      KeyConditionExpression: 'dataSource = :entryId',
      ExpressionAttributeValues: { ':entryId': req.params.entry }
    }
    db.query(entryQuery, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.json(data.Items)
      };
    });
  },
  read: (req, res) => {
    db.get({...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        res.json(data.Item);
      };
    });
  },
  update: (req, res) => {
    const updateParams = {...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}
    db.get(updateParams, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
          updateParams.UpdateExpression = 'set updated = :updated, title = :title, message = :message, geotag = :geotag',
          updateParams.ExpressionAttributeValues = {
            ':updated': Date.now(),
            ':title': checkString(req.body.title, data.Item.title),
            ':message': checkString(req.body.message, data.Item.message),
            ':geotag': checkGeo(req.body.geotag, data.Item.geotag)
        };
        db.update(updateParams, error => {
          if (error) {
            res.status(502).json({ error });
          } else {
            res.status(202).json({
              message: req.params.media + ' updated'
            });
          };
        });
      };
    });
  },
  delete: (req, res) => {
    db.delete({...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}, (error, data) => {
      if (error) {
        res.status(502).json({ error });
      } else {
        s3.deleteObject({
          Bucket: process.env.TRAVEL_DIARY_AWS_BUCKET,
          Key: req.filename
        }, (error, data) => {
          if (error) {
            res.status(502).json(error)
          } else {
            res.status(202).json({
              message: req.filename + ' deleted'
            });
          };
        });
      };
    });
  }
}