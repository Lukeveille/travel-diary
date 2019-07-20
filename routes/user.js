import aws from 'aws-sdk';

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

export default fetchByKey;