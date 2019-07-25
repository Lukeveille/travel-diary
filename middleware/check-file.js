export default (req, res, next) => {
  if (req.files[0]) {   
    next()
  } else {
    res.status(400).json({ error: 'You must attach a file' })
  }
};