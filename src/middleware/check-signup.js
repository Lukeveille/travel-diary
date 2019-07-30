import bcrypt from 'bcrypt';

export default (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(400).json({ error: "Invalid password"});
    } else {
      req.hash = hash;
      next();
    };
  });
};