import express from 'express';
import uuidv1 from 'uuid';
import upload from '../services/s3-upload';
import checkAuth from '../services/check-auth';
import checkTrip from '../services/check-trip';
import checkEntry from '../services/check-entry';
import checkString from '../services/check-string';
import checkGeo from '../services/check-geo';
import linkRegex from '../services/link-regex';
import { db } from '../services/aws-config';

const router = express.Router();
const params = { TableName: 'trip-diary' };
const singleUpload = upload.single('image');

// router.post('/:trip/:entry/new-media', checkAuth, checkTrip, checkEntry, (req, res) => {
router.post('/:trip/:entry/new-media', (req, res) => {
  // const media = {...params,
  //   Item: {
  //     created: Date.now(),
  //     dataKey: 'media-' + uuidv1().slice(0, 8),
  //     dataSource: req.params.entry,
  //     link: linkRegex.test(req.body.link)? req.body.link : null,
  //     user: req.userData.email,
  //     filename: req.body.filename || null,
  //     title: checkString(req.body.title),
  //     geotag: checkGeo(req.body.geotag)
  //   }
  // }
  console.log(req)
  singleUpload(req, res, next => {
    return res.json({ imageUrl: "111" });
  })
  // db.put(media, error => {
  //   if (error) {
  //     res.status(502).json({ error });
  //   } else {
  //     res.status(201).json({
  //       message: 'New media saved with id ' + media.Item.dataKey
  //     });
  //   };
  // });
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