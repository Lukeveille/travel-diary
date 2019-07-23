import express from "express";
import bodyParser from 'body-parser';
import fileUpload from './routes/file-upload';
import userRouter from './routes/user';
import tripRouter from './routes/trip';
import entryRouter from './routes/entry';

const app = express();
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.use('/', entryRouter);
apiRouter.use('/', userRouter);
apiRouter.use('/', tripRouter);
apiRouter.use('/file-upload', fileUpload);

const port = process.env.PORT || 443;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
