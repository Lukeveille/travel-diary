import deleteTrips from './delete-trips';
import { db } from '../services/aws-config';

export default (req, res, next) => {
  const message = { trips: [], errors: [] };
  const messages = (req, res, error, msg) => {
    if (error) {
      message.errors.push({ error, message: msg })
    };
  };
  const deleteQuery = {...req.table,
    Key: { dataSource: req.userData.email },
    KeyConditionExpression: 'dataSource = :dataSource',
    ExpressionAttributeValues: { ':dataSource': req.userData.email }
  };
  db.query(deleteQuery, (error, data) => {
    data.Items.forEach(item => {
      req.params.trip = item.dataKey
      deleteTrips(req, res, messages)
      message.trips.push(item.dataKey + ' and associated entries and media deleted')
    });
  });
  db.delete({...req.table, Key: { dataSource: 'user', dataKey: req.userData.email }}, (error, data) => {
    if (error) {
      next(error);
    } else {
      message.user = 'User with e-mail address ' + req.params.email + ' deleted'
      next(null, message)
    };
  });
};