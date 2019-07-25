import express from 'express';
import entries from '../controllers/entries';
import setTable from '../middleware/set-table';
import checkAuth from '../middleware/check-auth';
import checkTrip from '../middleware/check-trip';
import checkEntry from '../middleware/check-entry';

const router = express.Router();

router.post('/:trip/new-entry', checkAuth, setTable, checkTrip, entries.new);
router.get('/:trip/entries', checkAuth, setTable, checkTrip, entries.index);
router.get('/:trip/:entry', checkAuth, setTable, checkTrip, checkEntry, entries.read);
router.patch('/:trip/:entry', checkAuth, setTable, checkTrip, checkEntry, entries.update);
router.delete('/:trip/:entry', checkAuth, setTable, checkTrip, checkEntry, entries.delete);

export default router;