import app from './app';

const port = process.env.PORT || global.gConfig.node_port;

app.listen(port, () => {
  console.log(global.gConfig.config_id + ' server running on port ' + port);
});
