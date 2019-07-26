import express from 'express';
import media from '../controllers/media';
import upload from '../services/s3-upload';
import setTable from '../middleware/set-table';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';
import checkEntry from '../middleware/check-entry';
import checkFile from '../middleware/check-file';
import setId from '../middleware/set-id';

const router = express.Router();
const singleUpload = upload.any();

router.post('/:trip/:entry/media-upload', checkAuth, setTable, checkTrip, checkEntry, setId, singleUpload, checkFile, media.new);
router.get('/media', checkAuth, setTable, media.index.user);
router.get('/:trip/media', checkAuth, setTable, media.index.trip);
router.get('/:trip/:entry/media', checkAuth, setTable, media.index.entry);
router.get('/media/:media', checkAuth, setTable, media.read);
router.patch('/media/:media', checkAuth, setTable, media.update);
router.delete('/media/:media', checkAuth, setTable, media.delete);

export default router;