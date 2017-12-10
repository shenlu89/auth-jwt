const mongoose = require( 'mongoose' );
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, 
    required: true,
    default: Date.now
  },
  sessionDates: {
    type: [Date],
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST).toString('hex'); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.validPassword = function(password) {
  return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST).toString('hex');
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.newSessionDate = function() {
  this.sessionDates.push(new Date());
}

mongoose.model('User', userSchema);
