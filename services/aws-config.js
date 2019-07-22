import aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: 'http://dynamodb.'+ process.env.TRAVEL_DIARY_AWS_REGION + '.amazonaws.com',
  region: process.env.TRAVEL_DIARY_AWS_REGION
});

export const db = new aws.DynamoDB.DocumentClient();
export const s3 = new aws.S3();