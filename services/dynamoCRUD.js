import aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: 'http://dynamodb.'+ process.env.TRAVEL_DIARY_AWS_REGION + '.amazonaws.com',
  region: process.env.TRAVEL_DIARY_AWS_REGION
});

const db = new aws.DynamoDB.DocumentClient();

const crud = {
  response: (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      return JSON.stringify(data, null, 2);
    };
  },
  fetchByKey: (name, key) => {
    const params = {
      TableName: name,
      Key: key
    };
    return db.get(params, (err, data) => crud.response(err, data)).rawParams;
  },
  save: () => {
    const input = {
      email_id: 'fake@gmail.com'
    };
    const params = {
      TableName: 'users',
      Item: input
    };
    return db.put(params, (err, data) => crud.response(err, data)).rawParams;
  },
  modify: () => {
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
    return db.update(params, (err, data) => crud.response(err, data)).rawParams;
  },
  remove: () => {
    const params = {
      TableName: 'users',
      Key: {
        email_id: 'fake@gmail.com'
      }
    };
    return db.delete(params, (err, data) => crud.response(err, data)).rawParams;
  }
};

export default crud;