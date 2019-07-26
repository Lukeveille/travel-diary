import express from "express";
import bodyParser from 'body-parser';
import userRouter from './routes/user';
import tripRouter from './routes/trip';
import entryRouter from './routes/entry';
import mediaRouter from './routes/media';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.use('/media', mediaRouter);
apiRouter.use('/', userRouter);
apiRouter.use('/', tripRouter);
apiRouter.use('/', entryRouter);


const port = process.env.PORT || 443;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
