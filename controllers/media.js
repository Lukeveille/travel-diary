import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import { db } from '../services/aws-config';

const entry = (req, res, next, done) => {
  const entryQuery = {...req.table,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :entryId',
    ExpressionAttributeValues: { ':entryId': req.params.entry }
  }
  db.query(entryQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      req.Items = req.Items.concat(data.Items);
      if (done) { res.json(req.Items) }
    };
  });
}
const trip = (req, res, next, done = true) => {
  const entryQuery = {...req.table,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :tripId',
    ExpressionAttributeValues: { ':tripId': req.params.trip }
  }
  db.query(entryQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      for (let i = 0; i < data.Items.length; i++) {
        req.params.entry = data.Items[i].dataKey
        entry(req, res, next, (i+1 === data.Items.length && done))
      }
    };
  });
}
const user = (req, res, next) => {
  const entryQuery = {...req.table,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :userEmail',
    ExpressionAttributeValues: { ':userEmail': req.userData.email }
  }
  db.query(entryQuery, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      for (let i = 0; i < data.Items.length; i++) {
        req.params.trip = data.Items[i].dataKey
        trip(req, res, next, (i+1 === data.Items.length))
      }
    };
  });
}

export default {
  new: (req, res) => {
    const mediaLink = req.files[0].location.replace(
      'https://travel-diary.s3.us-east-2.amazonaws.com/',
      'https://d3k3ewady7k3ym.cloudfront.net/'
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
  index: {
    entry: (req, res, next) => {
      req.Items = [];
      entry(req, res, next, true);
    },
    trip: (req, res) => {
      req.Items = [];
      trip(req, res);
    },
    user: (req, res, next) => {
      req.Items = [];
      user(req, res);
    }
  },
  read: (req, res) => { res.json({where: 'aw shit'})},
  update: (req, res) => {},
  delete: (req, res) => {}
}