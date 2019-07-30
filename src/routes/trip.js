import express from 'express';
import trips from '../controllers/trips';
import setTable from '../middleware/set-table';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';

const router = express.Router();

router.post('/new-trip', checkAuth, setTable, trips.new);
router.get('/trips', checkAuth, setTable, trips.index);
router.get('/:trip', checkAuth, setTable, checkTrip, trips.read);
router.patch('/:trip', checkAuth, setTable, checkTrip, trips.update);
router.delete('/:trip', checkAuth, setTable, checkTrip, trips.delete);

export default router;