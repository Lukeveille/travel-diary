import deleteMedia from './delete-media';
import { db } from '../services/aws-config';

export default (req, res, next) => {
  const message = { entries: [], media: [], errors: [] };
  const messages = (req, res, error, msg) => {
    if (error) {
      message.errors.push({ error, message: msg })
    }
  };
  const deleteQuery = {...req.table,
    Key: { dataSource: req.params.entry },
    KeyConditionExpression: 'dataSource = :dataSource',
    ExpressionAttributeValues: { ':dataSource': req.params.entry }
  }
  db.query(deleteQuery, (error, data) => {
    data.Items.forEach(item => {
      req.params.media = item.dataKey
      req.filename = item.filename
      deleteMedia(req, res, messages)
      message.media.push(item.filename + ' deleted from db and s3')
    })
  })
  db.delete({...req.table, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
    if (error) {
      next(error)
    } else {
      message.entries.push(req.params.entry + ' deleted');
      next(null, message);
    };
  });
};