import deleteEntries from './delete-entries';
import { db } from '../services/aws-config';

export default (req, res, next) => {
  const message = { trips: [], entries: [], errors: [] };
  const messages = (req, res, error, msg) => {
    if (error) {
      message.errors.push({ error, message: msg })
    };
  };
  const deleteQuery = {...req.table,
    Key: { dataSource: req.params.trip },
    KeyConditionExpression: 'dataSource = :dataSource',
    ExpressionAttributeValues: { ':dataSource': req.params.trip }
  };
  db.query(deleteQuery, (error, data) => {
    data.Items.forEach(item => {
      req.params.entry = item.dataKey
      deleteEntries(req, res, messages)
      message.entries.push(item.dataKey + ' and associated media deleted')
    });
  });
  db.delete({...req.table, Key: { dataSource: req.userData.email, dataKey: req.params.trip }}, (error, data) => {
    if (error) {
      next(error);
    } else {
      message.trips.push(req.params.trip + ' deleted')
      next(null, message);
    };
  });
};