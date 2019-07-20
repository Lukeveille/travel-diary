import express from 'express';
import aws from 'aws-sdk';

const router = express.Router();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: 'http://dynamodb.'+ process.env.TRAVEL_DIARY_AWS_REGION + '.amazonaws.com',
  region: process.env.TRAVEL_DIARY_AWS_REGION
});

const db = new aws.DynamoDB.DocumentClient();

const fetchByKey = () => {
  const params = {
    TableName: 'users',
    Key: {
      email_id: 'luke@lukeleveille.com'
    }
  };
  db.get(params, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
};

const save = () => {
  const input = {
    email_id: 'fake@gmail.com'
  };
  const params = {
    TableName: 'users',
    Item: input
  };
  db.put(params, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    };
  });
};

const modify = () => {
  const params = {
    TableName: 'users',
    Key: { email_id: 'fake@gmail.com' },
    UpdateExpression: 'set updated_by = :byUser, is_deleted = :boolValue',
    ExpressionAttributeValues: {
      ':byUser': 'updateUser',
      ':boolValue': true
    },
    ReturnValues: 'UPDATED_NEW'
  };
  db.update(params, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    };
  });
};

const remove = () => {
  const params = {
    TableName: 'users',
    Key: {
      email_id: 'fake@gmail.com'
    }
  };
  db.delete(params, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    };
  });
};

router.get('/', (req, res) => {
  fetchByKey();
  res.status(201).json({
    console: 'log'
  })
});

export default router;