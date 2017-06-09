/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 
  //'localhost:27017' || 
  'mongodb://admin:admin@ds143181.mlab.com:43181/cse112',
  port: process.env.PORT || 4941,
  secret: process.env.SECRET || 'mysecret'
};
