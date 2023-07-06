const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be provided'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Not a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'recruiter', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    min: [8, 'Password must be atleast 8 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirmation password is required'],
    validate: {
      message: "Passwords don't match",
      validator: function (password) {
        return this.password === password;
      },
    },
  },
  passwordChangedAt: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetTokenExpiration: { type: Date, select: false },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//* removing the passwordConfirm property after all validations are done and before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

//* setting the passwordChangedAt in case an existing user changed the password it is modified
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew)
    this.passwordChangedAt = Date.now() - 1000;
  next();
});

//* this middleware filters all inactive user accounts from every type of find query
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.method(
  'checkCorrectPassword',
  // eslint-disable-next-line prefer-arrow-callback
  async function (candidatePassword, encryptedUserPassword) {
    return await bcrypt.compare(candidatePassword, encryptedUserPassword);
  }
);

userSchema.method(
  'changedPasswordAfter',
  // eslint-disable-next-line prefer-arrow-callback
  function (passwordChangedAtDate, JWTTimestamp) {
    if (passwordChangedAtDate) {
      const passwordChangedAtTimestamp = parseInt(
        passwordChangedAtDate.getTime() / 1000,
        10
      );
      return passwordChangedAtTimestamp > JWTTimestamp;
    }
    return false;
  }
);

userSchema.method('createPasswordResetToken', function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;
  return resetToken;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
