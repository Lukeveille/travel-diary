import express from "express";
import bodyParser from 'body-parser';
import fileUpload from './routes/file-upload';
import userRouter from './routes/user';
import tripRouter from './routes/trip';

const app = express();
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);
apiRouter.use('/file-upload', fileUpload);
apiRouter.use('/users', userRouter);
apiRouter.use('/trips', tripRouter);

const port = process.env.PORT || 443;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
