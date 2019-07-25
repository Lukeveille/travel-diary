import express from 'express';
import users from '../controllers/users';
import checkAuth from '../middleware/check-auth';
import setTable from '../middleware/set-table';
import checkUser from '../middleware/check-user';
import checkSignup from '../middleware/check-signup';
import checkCredentials from '../middleware/check-credentials';
import validateUser from '../middleware/validate-user';

const router = express.Router();

router.post('/signup', checkCredentials, setTable, checkUser, checkSignup, users.signup);
router.post('/login', setTable, validateUser, users.login);
router.delete('/:email', checkAuth, setTable, validateUser, users.delete);

export default router;