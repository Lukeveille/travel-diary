import { db } from '../services/aws-config';
import { s3 } from '../services/aws-config';

export default (req, res, next) => {
  let message = ''
  db.delete({...req.table, Key: { dataSource: req.params.entry, dataKey: req.params.media }}, (error, data) => {
    if (error) {
      next(req, res, error)
    } else {
      message = req.filename + ' deleted from db'
    };
  });
  s3.deleteObject({
    Bucket: process.env.TRAVEL_DIARY_AWS_BUCKET,
    Key: req.filename
  }, (error, data) => {
    if (error) {
      next(req, res, error, message)
    } else {
      next(req, res, null, message + ' and s3')
    };
  });
};