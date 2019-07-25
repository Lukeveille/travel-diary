import checkString from '../middleware/check-string';
import checkGeo from '../middleware/check-geo';
import { db } from '../services/aws-config';

export default {
  new: (req, res) => {
    const mediaLink = req.files[0].location.replace(
      'https://travel-diary.s3.us-east-2.amazonaws.com/',
      'https://d3k3ewady7k3ym.cloudfront.net/'
    )
    const media = {...req.table,
      Item: {
        created: Date.now(),
        dataKey: 'media-' + req.mediaId,
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
  index: 0,
  read: 0,
  update: 0,
  delete: 0,
}