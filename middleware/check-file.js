export default (req, res, next) => {
  const fileRegex = new RegExp(/^.*\.(jpg|gif|png|mp4|mov|webm|mp3|aac|aiff|m4a|wav)$/, 'i');
  if (req.files[0]) {   
    fileRegex.test(req.files[0].key)? next() : res.status(406).json({ error: 'Invalid file type' })
  } else {
    res.status(400).json({ error: 'You must attach a file' })
  }
};