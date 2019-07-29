import express from "express";
import bodyParser from 'body-parser';
import config from './config/config.js';
import userRouter from './routes/user';
import tripRouter from './routes/trip';
import entryRouter from './routes/entry';
import mediaRouter from './routes/media';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.get('/health', (req, res) => {
  res.json({health: 'OK'});
})

apiRouter.use('/', userRouter);
apiRouter.use('/', tripRouter);
apiRouter.use('/', entryRouter);
apiRouter.use('/', mediaRouter);


const port = process.env.PORT || global.gConfig.node_port;

app.listen(port, () => {
  console.log(global.gConfig.config_id + ' server running on port ' + port);
});
