export default (req, res, next) => {
  const fileRegex = new RegExp(/^.*\.(jpg|gif|png|mp4|mov|webm|mp3|aac|aiff|m4a|wav)$/, 'i');
  if (req.files[0]) {
    const sizeLimit =  req.files[0].size < 25*10**7;
    fileRegex.test(req.files[0].key) && sizeLimit? next() : res.status(406).json({ error: sizeLimit? 'Invalid file type' : 'File cannot be larger than 250MB'})
  } else {
    res.status(400).json({ error: 'You must attach a file' })
  }
};