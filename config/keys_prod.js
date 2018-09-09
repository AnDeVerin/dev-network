module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  expiresIn: 86400, // jwt-token life time in sec
};
