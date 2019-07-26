import express from 'express';
import media from '../controllers/media';
import upload from '../services/s3-upload';
import setTable from '../middleware/set-table';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';
import checkEntry from '../middleware/check-entry';
import checkMedia from '../middleware/check-media';
import checkFile from '../middleware/check-file';
import setId from '../middleware/set-id';

const router = express.Router();
const singleUpload = upload.any();

router.post('/:trip/:entry', checkAuth, setTable, checkTrip, checkEntry, setId, singleUpload, checkFile, media.new);
router.get('/:entry', checkAuth, setTable, media.index);
router.get('/:entry/:media', checkAuth, setTable, checkMedia, media.read);
router.patch('/:entry/:media', checkAuth, setTable, media.update);
router.delete('/:entry/:media', checkAuth, setTable, checkMedia, media.delete);

export default router;