import express from 'express';
import upload from '../services/s3-upload';

const router = express.Router();
const singleUpload = upload.single('image');

router.post('/', (req, res) => {
  singleUpload(req, res, err => {
    return res.json({ imageUrl: req.file });
  });
});

export default router;
