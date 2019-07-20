import express from "express";
import fileUpload from './routes/file-upload';
import userRouter from './routes/user';

const app = express();
const apiRouter = express.Router();

app.use('/api/v1', apiRouter);
apiRouter.use('/file-upload', fileUpload);
apiRouter.use('/user', userRouter);

apiRouter.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

const port = process.env.PORT || 443;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
