import express from 'express';
import uuidv1 from 'uuid';
import upload from '../services/s3-upload';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';
import checkEntry from '../middleware/check-entry';
import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import checkFile from '../middleware/check-file';
import setId from '../middleware/set-id';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };
const singleUpload = upload.any();

router.post('/:trip/:entry/new-media', checkAuth, checkTrip, checkEntry, setId, singleUpload, checkFile, (req, res) => {
  const mediaLink = req.files[0].location.replace(
    'https://travel-diary.s3.us-east-2.amazonaws.com/',
    'https://d3k3ewady7k3ym.cloudfront.net/'
  )
  const media = {...params,
    Item: {
      created: Date.now(),
      dataKey: 'media-' + uuidv1().slice(0, 8),
      dataSource: req.params.entry,
      link: mediaLink,
      filename: req.mediaId + '_' + req.files[0].originalname,
      fileType: req.files[0].mimetype,
      title: checkString(req.body.title),
      geotag: checkGeo({lat: req.body.lat, long: req.body.long})
    }
  };
  console.log(media)
  db.put(media, error => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(201).json({
        message: 'New media saved with id ' + media.Item.dataKey + '. link: ' + mediaLink
      });
    };
  });
});

router.get('/:entry/media', checkAuth, (req, res) => {
  // const entryQuery = {...params,
  //   Key: { dataSource: req.params.trip },
  //   KeyConditionExpression: 'dataSource = :tripId',
  //   ExpressionAttributeValues: { ':tripId': req.params.trip }
  // }
  // db.query(entryQuery, (error, data) => {
  //   if (error) {
  //     res.status(502).json({ error });
  //   } else {
  //     res.status(200).json(data.Items);
  //   };
  // });
});
// router.get('/:trip/media', checkAuth, (req, res) => {
//   const tripQuery = {...params,
//   }
//   db.query(tripQuery, (error, data) => {
//     if (error) {
//       res.status(502).json({ error });
//     } else {
//       res.status(200).json(data.Items);
//     };
//   });
// });
// router.get('/all-media', checkAuth, (req, res) => {
//   const userQuery = {...params,
//   }
//   db.query(userQuery, (error, data) => {
//     if (error) {
//       res.status(502).json({ error });
//     } else {
//       res.status(200).json(data.Items);
//     };
//   });
// });

router.get('/:media', checkAuth, (req, res) => {
  // db.get({...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}, (error, data) => {
  //   if (error) {
  //     res.status(502).json({ error });
  //   } else {
  //     res.status(200).json(data.Item);
  //   };
  // });
});

router.patch('/:media', checkAuth, (req, res) => {
  // const updateParams = {...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}
  // db.get(updateParams, (error, data) => {
  //   if (error) {
  //     res.status(502).json({ error });
  //   } else {
  //       updateParams.UpdateExpression = 'set message = :message, title = :title, locationName = :locationName, link = :link, geotag = :geotag',
  //       updateParams.ExpressionAttributeValues = {
  //         ':message': req.body.message || data.Item.message,
  //         ':title': req.body.title || data.Item.title,
  //         ':locationName': req.body.locationName || data.Item.locationName,
  //         ':link': req.body.link || data.Item.link,
  //         ':geotag': req.body.geotag || data.Item.geotag
  //     };
  //     db.update(updateParams, (error, data) => {
  //       if (error) {
  //         res.status(502).json({ error });
  //       } else {
  //         res.status(202).json({
  //           message: 'Trip with id ' + req.params.id + ' updated'
  //         });
  //       };
  //     });
  //   };
  // });
});

router.delete('/:media', checkAuth, (req, res) => {
  // db.delete({...params, Key: { dataSource: req.params.trip, dataKey: req.params.id }}, (error, data) => {
  //   if (error) {
  //     res.status(502).json({ error });
  //   } else {
  //     res.status(202).json({
  //       message: 'Trip with id ' + req.params.id + ' deleted'
  //     });
  //   };
  // });
});

export default router;