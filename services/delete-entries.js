import deleteMedia from '../services/delete-media';
import { db } from '../services/aws-config';

export default (req, res) => {
  const messages = (req, res, error, message) => {
    if (error) {
      res.status(502).json(error)
    }
  };
  const deleteQuery = {...req.table,
    Key: { dataSource: req.params.entry },
    KeyConditionExpression: 'dataSource = :tripId',
    ExpressionAttributeValues: { ':tripId': req.params.entry }
  }
  db.query(deleteQuery, (error, data) => {
    data.Items.forEach(item => {
      req.params.media = item.dataKey
      req.filename = item.filename
      deleteMedia(req, res, messages)
    })
  })
  db.delete({...req.table, Key: { dataSource: req.params.trip, dataKey: req.params.entry }}, (error, data) => {
    if (error) {
      res.status(502).json({ error });
    } else {
      res.status(202).json({
        message: req.params.entry + ' and associated media deleted',
        messages: req.messages
      });
    };
  });
};