import express from "express";
import fileUpload from './routes/file-upload';

const app = express();
const apiRouter = express.Router();

app.use('/api/v1', apiRouter);
apiRouter.use('/file-upload', fileUpload);

apiRouter.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
