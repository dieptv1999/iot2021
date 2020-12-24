const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Joi = require("joi");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  publicKey: {
    type: String,
    required: false
  },
  role: {
    type: Number,
    required: true,
    default: 0,
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    // console.log('password changed')
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// function to validate user
const validateUser = (user) => {
  const schema = Joi.object({
    role: Joi.number().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
