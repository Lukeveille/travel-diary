import { s3 } from './aws-config';
import multer from 'multer';
import multerS3 from 'multer-s3';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.TRAVEL_DIARY_AWS_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: 'testing'});
    },
    key: (req, file, cb) => {
      // console.log(file)
      cb(null, file.originalname.toString());
    }
  })
});

export default upload;