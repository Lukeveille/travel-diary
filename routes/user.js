import express from 'express';
// import aws from 'aws-sdk';
import crud from '../services/dynamoCRUD';

const router = express.Router();

router.get('/', (req, res) => {
  const userEmail = { email_id: 'luke@lukeleveille.com' };
  const getUser = crud.fetchByKey('users', userEmail);
  console.log(getUser);
  res.status(201).json({
    console: 'log'
  })
});

router.put('/', (req, res) => {

});

export default router;