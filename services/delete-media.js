import { db } from '../services/aws-config';
import { s3 } from '../services/aws-config';

export default (req, res, next) => {
  let message = ''
  db.delete({...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}, (error, data) => {
    if (error) {
      next(error, res)
    } else {
      message = req.filename + ' deleted from db'
    };
  });
  s3.deleteObject({
    Bucket: process.env.TRAVEL_DIARY_AWS_BUCKET,
    Key: req.filename
  }, (error, data) => {
    if (error) {
      next(error, res, message)
    } else {
      next(null, res, message + ' and s3')
    };
  });
};